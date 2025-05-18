import TrieMap "mo:base/TrieMap";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Option "mo:base/Option";

import Seed "modules/seed";
import Memory "modules/memory";

actor Storage {
  // stable is used to store data that should persist across upgrades.
  stable var stableStore : Memory.StableStore = [];

  // store is used to store data that should not persist across upgrades.
  var heapStore : Memory.HeapStore = TrieMap.TrieMap<Text, Text>(Text.equal, Text.hash);

  // The preupgrade function is called before an upgrade
  // and stores the entries of the heapStore in the stableStore.
  system func preupgrade() {
    // Convert the stable store to a heap store
    var stableStoreEntries = Memory.convertStableToHeap(stableStore);

    // If a key is already in the stable store, update the value
    // If the key is not in the stable store, add it to the stable store
    for ((k, v) in heapStore.entries()) {
      stableStoreEntries.put(k, v);
    };

    // Convert back stableStoreEntries to a stable store
    stableStore := Iter.toArray(stableStoreEntries.entries());

    // Clear the heap store
    heapStore := TrieMap.TrieMap<Text, Text>(Text.equal, Text.hash);
  };

  public func add(key : Text, item : Text) : async Text {
    // Check the size of the item
    if (Memory.isItemSizeExceedLimit(item)) {
      return "Item size exceeds limit";
    };

    // Save the item to the heap store
    heapStore.put(key, item);

    // Check store size
    // TODO: Save to stable storage. Setup multiple canisters
    // to store data if the size exceeds the limit.
    if (Memory.isStoreMax(heapStore)) {
      return "Store size exceeds limit";
    };

    return "Item added successfully";
  };

  public func get(key : Text) : async ?Text {
    // Check if the key exists in the heap store
    // If it does, return the value
    // If it doesn't, check the stable storage
    // If it exists in the stable storage, return the value
    // If it doesn't, return null
    if (heapStore.get(key) != null) {
      return heapStore.get(key);
    } else {
      // Check the stable storage
      let convertedStableStore = Memory.convertStableToHeap(stableStore);

      if (convertedStableStore.get(key) != null) {
        let value : ?Text = convertedStableStore.get(key);
        let stableValue : Text = Option.get(value, ""); // Should never be null

        // Add the key to the heap store
        // This is to avoid checking the stable storage again
        // in the next call
        heapStore.put(key, stableValue);

        // Get the value from the stable storage
        return value;
      } else {
        return null;
      };
    };
  };

  public func getAllInHeap() : async [(Text, Text)] {
    return Iter.toArray(heapStore.entries());
  };

  public func getAllInStable() : async [(Text, Text)] {
    return Iter.toArray(stableStore.vals());
  };

  public func generateSeed() : async ?Nat {
    return await Seed.generateSeed();
  };
};
