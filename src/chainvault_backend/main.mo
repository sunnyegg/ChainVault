import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Types "./modules/Types";
import KeyValueStore "./modules/KeyValueStore";
import FileStore "./modules/FileStore";

actor Storage {
  // Data stores
  stable var stableStore : [(Text, Text)] = [];
  stable var stableFileInfoStore : [(Types.FileId, Types.FileInfo)] = [];
  stable var stableChunkStore : [(Text, Text)] = [];

  private let kvStore = KeyValueStore.Store();
  private let fileStore = FileStore.FileStore();

  // Initialize from stable storage
  if (stableStore.size() > 0 or stableFileInfoStore.size() > 0 or stableChunkStore.size() > 0) {
    kvStore.fromStable(stableStore);
    fileStore.fromStable(stableFileInfoStore, stableChunkStore);
  };

  // Regular key-value methods
  public func add(key : Text, item : Text) : async () {
    kvStore.add(key, item);
  };

  public query func get(key : Text) : async ?Text {
    kvStore.get(key);
  };

  public query func getAllKeys() : async [Text] {
    kvStore.getAllKeys();
  };

  public func delete(key : Text) : async Bool {
    kvStore.delete(key);
  };

  // Chunked file storage methods
  public func beginFileUpload(fileId : Types.FileId, fileName : Text, totalSize : Nat) : async () {
    fileStore.beginFileUpload(fileId, fileName, totalSize);
  };

  public func uploadChunk(fileId : Types.FileId, chunkId : Types.ChunkId, chunk : Text) : async Bool {
    fileStore.uploadChunk(fileId, chunkId, chunk);
  };

  public query func getFileInfo(fileId : Types.FileId) : async ?Types.FileInfo {
    fileStore.getFileInfo(fileId);
  };

  public query func getFileChunk(fileId : Types.FileId, chunkId : Types.ChunkId) : async ?Text {
    fileStore.getFileChunk(fileId, chunkId);
  };

  public func deleteFile(fileId : Types.FileId) : async Bool {
    fileStore.deleteFile(fileId);
  };

  public query func listFiles() : async [(Types.FileId, Types.FileInfo)] {
    fileStore.listFiles();
  };

  public query func listFileChunks(fileId : Types.FileId) : async [(Types.ChunkId, Text)] {
    fileStore.listFileChunks(fileId);
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
