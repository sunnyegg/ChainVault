import Seed "modules/seed";
import TrieMap "mo:base/TrieMap";
import Text "mo:base/Text";
import Iter "mo:base/Iter";

actor Storage {
  // stable is used to store data that should persist across upgrades.
  stable var storeEntries : [(Text, Text)] = [];

  // store is used to store data that should not persist across upgrades.
  var store = TrieMap.TrieMap<Text, Text>(Text.equal, Text.hash);

  // The stable variable storeEntries is used to store the entries of the TrieMap
  // before an upgrade. The preupgrade function is called before an upgrade
  // and stores the entries of the TrieMap in the stable variable storeEntries.
  system func preupgrade() {
    storeEntries := Iter.toArray(store.entries());
  };

  // postupgrade is called after an upgrade and restores the entries of the TrieMap
  // from the stable variable storeEntries. The storeEntries variable is
  // initialized to an empty array after the upgrade.
  system func postupgrade() {
    store := TrieMap.fromEntries<Text, Text>(storeEntries.vals(), Text.equal, Text.hash);
  };

  public func add(key : Text, item : Text) : async () {
    store.put(key, item);
  };

  public func get(key : Text) : async ?Text {
    return store.get(key);
  };

  public func getAll() : async [Text] {
    return Iter.toArray(store.vals());
  };

  public func generateSeed() : async ?Nat {
    return await Seed.generateSeed();
  };
}