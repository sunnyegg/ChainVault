import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Types "./modules/Types";
import KeyValueStore "./modules/KeyValueStore";
import FileStore "./modules/FileStore";
import Prim "mo:prim";
import Array "mo:base/Array";
import Time "mo:base/Time";

actor Storage {
  // Data stores
  stable var stableStore : [(Text, Text)] = [];
  stable var stableFileInfoStore : [(Types.FileId, Types.FileInfo)] = [];
  stable var stableChunkStore : [(Text, Text)] = [];

  private let kvStore = KeyValueStore.Store();
  private let fileStore = FileStore.FileStore();

  // Heap memory thresholds (in bytes)
  private let heapMaxSize = 4_000_000_000; // 4GB
  private let heapThreshold = heapMaxSize / 2; // 50% threshold

  // Default: 1 day in seconds
  private let defaultExpirationSeconds : Nat = 1 * 24 * 60 * 60;

  // Initialize from stable storage
  if (stableStore.size() > 0 or stableFileInfoStore.size() > 0 or stableChunkStore.size() > 0) {
    kvStore.fromStable(stableStore);
    fileStore.fromStable(stableFileInfoStore, stableChunkStore);
  };

  // Helper function to check heap size and move data to stable storage if needed
  private func checkAndMoveToStable() : () {
    let heapSize = Prim.rts_heap_size();
    if (heapSize > heapThreshold) {
      // Save current state to stable variables
      stableStore := Iter.toArray(kvStore.entries());
      stableFileInfoStore := Iter.toArray(fileStore.fileInfoEntries());
      stableChunkStore := Iter.toArray(fileStore.chunkEntries());

      kvStore.clear();
      fileStore.clear();
    };
  };

  public func add(key : Text, item : Text) : async () {
    kvStore.add(key, item);
    checkAndMoveToStable();
  };

  public query func get(key : Text) : async ?Text {
    kvStore.get(key);
  };

  public query func getAllKeys() : async [Text] {
    kvStore.getAllKeys();
  };

  public func delete(key : Text) : async Bool {
    let deleted = kvStore.delete(key);

    // If the data might be in stable storage, update it as well
    if (deleted) {
      // Filter out the deleted key from stableStore
      stableStore := Array.filter<(Text, Text)>(stableStore, func((k, _)) { k != key });
    };

    deleted;
  };

  // Chunked file storage methods
  public func beginFileUpload(fileId : Types.FileId, fileName : Text, totalSize : Nat, expirationSeconds : ?Nat) : async () {
    let expirationTime = switch (expirationSeconds) {
      case (null) {
        ?((Time.now()) + (defaultExpirationSeconds * 1_000_000_000));
      };
      case (?seconds) { ?((Time.now()) + (seconds * 1_000_000_000)) };
    };
    fileStore.beginFileUpload(fileId, fileName, totalSize, expirationTime);
    checkAndMoveToStable();
  };

  public func uploadChunk(fileId : Types.FileId, chunkId : Types.ChunkId, chunk : Text) : async Bool {
    let result = fileStore.uploadChunk(fileId, chunkId, chunk);
    checkAndMoveToStable();
    result;
  };

  public query func getFileInfo(fileId : Types.FileId) : async ?Types.FileInfo {
    switch (fileStore.getFileInfo(fileId)) {
      case (null) { null };
      case (?fileInfo) {
        // Check if the file is expired
        if (fileStore.isExpired(fileInfo)) {
          // File has expired, return null as if it doesn't exist
          null;
        } else {
          // File exists and hasn't expired
          ?fileInfo;
        };
      };
    };
  };

  public query func getFileChunk(fileId : Types.FileId, chunkId : Types.ChunkId) : async ?Text {
    fileStore.getFileChunk(fileId, chunkId);
  };

  public func deleteFile(fileId : Types.FileId) : async Bool {
    let deleted = fileStore.deleteFile(fileId);

    // If deleted successfully, also update stable storage
    if (deleted) {
      // Remove file info from stable storage
      stableFileInfoStore := Array.filter<(Types.FileId, Types.FileInfo)>(
        stableFileInfoStore,
        func((id, _)) { id != fileId },
      );

      // Remove all chunks associated with this file from stable storage
      stableChunkStore := Array.filter<(Text, Text)>(
        stableChunkStore,
        func((chunkKey, _)) {
          // Match exactly fileId followed by underscore
          not Text.startsWith(chunkKey, #text(fileId # "_"));
        },
      );
    };

    deleted;
  };

  public query func listFiles() : async [(Types.FileId, Types.FileInfo)] {
    fileStore.listFiles();
  };

  public query func listFileChunks(fileId : Types.FileId) : async [(Types.ChunkId, Text)] {
    fileStore.listFileChunks(fileId);
  };

  // Function to clean up expired files
  private func cleanupExpiredFiles() : async Nat {
    let expiredFiles = fileStore.getExpiredFiles();
    var deletedCount = 0;

    for ((fileId, _) in expiredFiles.vals()) {
      let deleted = fileStore.deleteFile(fileId);
      if (deleted) {
        // Also update stable storage
        stableFileInfoStore := Array.filter<(Types.FileId, Types.FileInfo)>(
          stableFileInfoStore,
          func((id, _)) { id != fileId },
        );

        stableChunkStore := Array.filter<(Text, Text)>(
          stableChunkStore,
          func((chunkKey, _)) {
            not Text.startsWith(chunkKey, #text(fileId # "_"));
          },
        );

        deletedCount += 1;
      };
    };

    checkAndMoveToStable();
    deletedCount;
  };

  // Timer for periodic cleanup
  private var nextCleanupTime = Time.now() + (24 * 60 * 60 * 1_000_000_000); // 24 hours from now

  system func heartbeat() : async () {
    if (Time.now() > nextCleanupTime) {
      ignore await cleanupExpiredFiles();
      nextCleanupTime := Time.now() + (24 * 60 * 60 * 1_000_000_000); // Schedule next cleanup
    };
  };

  // System upgrade functions
  system func preupgrade() {
    stableStore := Iter.toArray(kvStore.entries());
    stableFileInfoStore := Iter.toArray(fileStore.fileInfoEntries());
    stableChunkStore := Iter.toArray(fileStore.chunkEntries());
  };

  system func postupgrade() {
    kvStore.fromStable(stableStore);
    fileStore.fromStable(stableFileInfoStore, stableChunkStore);
  };
};
