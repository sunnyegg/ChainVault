import Text "mo:base/Text";
import Iter "mo:base/Iter";
import TrieMap "mo:base/TrieMap";

module {
  public type HeapStore = TrieMap.TrieMap<Text, Text>;
  public type StableStore = [(Text, Text)];
  
  public func isItemSizeExceedLimit(item : Text) : Bool {
    // Check the size of the item
    // The maximum size of the item is 100 Mbytes
    if (Text.size(item) > 100_000_000) {
      return true;
    };

    return false;
  };

  public func isStoreMax(store : HeapStore) : Bool {
    // Check the size of the store
    // The maximum size of the store is 500 Mbytes

    // List all the vals in the store
    var storeVals = Iter.toArray(store.vals());
    var totalSize = 0;
    for (v in storeVals.vals()) {
      totalSize += Text.size(v);
    };

    // Check if the total size of the store is less than 500 Mbytes
    if (totalSize > 500_000_000) {
      return true;
    };

    return false;
  };

  public func convertStableToHeap(store : StableStore) : HeapStore {
    // Convert the stable storage to a heap storage
    var heapStore : HeapStore = TrieMap.TrieMap<Text, Text>(Text.equal, Text.hash);
    for ((k, v) in store.vals()) {
      heapStore.put(k, v);
    };

    return heapStore;
  };
}