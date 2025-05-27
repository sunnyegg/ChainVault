import Time "mo:base/Time";

module {
  public type ChunkId = Nat;
  public type FileId = Text;

  public type FileInfo = {
    name : Text;
    totalChunks : Nat;
    currentChunks : Nat;
    totalSize : Nat;
    creationTime : Time.Time;
    expirationTime : ?Time.Time;
  };
};
