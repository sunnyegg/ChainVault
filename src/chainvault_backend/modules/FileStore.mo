import Text "mo:base/Text";
import Iter "mo:base/Iter";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Types "./Types";
import Time "mo:base/Time";

module {
  // Constants
  private let CHUNK_SIZE : Nat = 270_000; // ~270KB chunks

  public class FileStore() {
    private var fileInfoStore = HashMap.HashMap<Types.FileId, Types.FileInfo>(0, Text.equal, Text.hash);
    private var chunkStore = HashMap.HashMap<Text, Text>(0, Text.equal, Text.hash);

    public func beginFileUpload(fileId : Types.FileId, fileName : Text, totalSize : Nat, expirationTime : ?Time.Time) {
      let now = Time.now();
      let fileInfo : Types.FileInfo = {
        name = fileName;
        totalChunks = calculateTotalChunks(totalSize);
        currentChunks = 0;
        totalSize = totalSize;
        creationTime = now;
        expirationTime = expirationTime;
      };
      fileInfoStore.put(fileId, fileInfo);
    };

    public func uploadChunk(fileId : Types.FileId, chunkId : Types.ChunkId, chunk : Text) : Bool {
      switch (fileInfoStore.get(fileId)) {
        case (null) {
          return false; // File upload not initialized
        };
        case (?fileInfo) {
          if (chunkId >= fileInfo.totalChunks) {
            return false; // Invalid chunk ID
          };

          // Store the chunk
          let chunkKey = fileId # "_" # Nat.toText(chunkId);
          chunkStore.put(chunkKey, chunk);

          // Update file info
          let updatedInfo : Types.FileInfo = {
            name = fileInfo.name;
            totalChunks = fileInfo.totalChunks;
            currentChunks = fileInfo.currentChunks + 1;
            totalSize = fileInfo.totalSize;
            creationTime = fileInfo.creationTime;
            expirationTime = fileInfo.expirationTime;
          };
          fileInfoStore.put(fileId, updatedInfo);

          return true;
        };
      };
    };

    public func getFileInfo(fileId : Types.FileId) : ?Types.FileInfo {
      fileInfoStore.get(fileId);
    };

    public func getFileChunk(fileId : Types.FileId, chunkId : Types.ChunkId) : ?Text {
      let chunkKey = fileId # "_" # Nat.toText(chunkId);
      chunkStore.get(chunkKey);
    };

    public func deleteFile(fileId : Types.FileId) : Bool {
      switch (fileInfoStore.get(fileId)) {
        case (null) { return false };
        case (?fileInfo) {
          // Delete all chunks
          for (i in Iter.range(0, fileInfo.totalChunks - 1)) {
            let chunkKey = fileId # "_" # Nat.toText(i);
            chunkStore.delete(chunkKey);
          };

          // Delete file info
          fileInfoStore.delete(fileId);
          return true;
        };
      };
    };

    private func calculateTotalChunks(size : Nat) : Nat {
      (size + CHUNK_SIZE - 1) / CHUNK_SIZE // Ceiling division
    };

    public func listFiles() : [(Types.FileId, Types.FileInfo)] {
      Iter.toArray(fileInfoStore.entries());
    };

    public func listFileChunks(fileId : Types.FileId) : [(Types.ChunkId, Text)] {
      switch (fileInfoStore.get(fileId)) {
        case (null) { return [] };
        case (?fileInfo) {
          var chunks : [(Types.ChunkId, Text)] = [];
          for (i in Iter.range(0, fileInfo.totalChunks - 1)) {
            let chunkKey = fileId # "_" # Nat.toText(i);
            switch (chunkStore.get(chunkKey)) {
              case null { /* Skip if chunk not found */ };
              case (?content) {
                chunks := [(i : Types.ChunkId, content)];
              };
            };
          };
          chunks;
        };
      };
    };

    public func fileInfoEntries() : Iter.Iter<(Types.FileId, Types.FileInfo)> {
      fileInfoStore.entries();
    };

    public func chunkEntries() : Iter.Iter<(Text, Text)> {
      chunkStore.entries();
    };

    public func fromStable(stableFileInfoData : [(Types.FileId, Types.FileInfo)], stableChunkData : [(Text, Text)]) {
      fileInfoStore := HashMap.fromIter<Types.FileId, Types.FileInfo>(
        Iter.fromArray(stableFileInfoData),
        stableFileInfoData.size(),
        Text.equal,
        Text.hash,
      );

      chunkStore := HashMap.fromIter<Text, Text>(
        Iter.fromArray(stableChunkData),
        stableChunkData.size(),
        Text.equal,
        Text.hash,
      );
    };

    public func clear() : () {
      fileInfoStore := HashMap.HashMap<Types.FileId, Types.FileInfo>(0, Text.equal, Text.hash);
      chunkStore := HashMap.HashMap<Text, Text>(0, Text.equal, Text.hash);
    };

    // Check if a file is expired
    public func isExpired(fileInfo : Types.FileInfo) : Bool {
      switch (fileInfo.expirationTime) {
        case (null) { false }; // No expiration set
        case (?expTime) { expTime < Time.now() };
      };
    };

    // Get all expired files
    public func getExpiredFiles() : [(Types.FileId, Types.FileInfo)] {
      Iter.toArray(
        Iter.filter(
          fileInfoStore.entries(),
          func((_, info) : (Types.FileId, Types.FileInfo)) : Bool {
            isExpired(info);
          },
        )
      );
    };
  };
};
