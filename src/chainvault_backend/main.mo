import Array "mo:base/Array";

actor Storage {
  stable var store : [Text] = [];

  public func add(item : Text) : async () {
    store := Array.append(store, [item]);
  };

  public func getAll() : async [Text] {
    return store;
  };
}