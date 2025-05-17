import Array "mo:base/Array";
import Seed "modules/seed";

actor Storage {
  stable var store : [Text] = [];

  public func add(item : Text) : async () {
    store := Array.append(store, [item]);
  };

  public func getAll() : async [Text] {
    return store;
  };

  public func generateSeed() : async ?Nat {
    return await Seed.generateSeed();
  };
}