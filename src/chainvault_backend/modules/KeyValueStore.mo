import Text "mo:base/Text";
import Iter "mo:base/Iter";
import HashMap "mo:base/HashMap";

module {
  public class Store() {
    private var store = HashMap.HashMap<Text, Text>(0, Text.equal, Text.hash);

    public func add(key : Text, item : Text) {
      store.put(key, item);
    };

    public func get(key : Text) : ?Text {
      store.get(key);
    };

    public func getAllKeys() : [Text] {
      Iter.toArray(store.keys());
    };

    public func delete(key : Text) : Bool {
      switch (store.get(key)) {
        case (null) { false };
        case (?_) {
          store.delete(key);
          true;
        };
      };
    };

    public func entries() : Iter.Iter<(Text, Text)> {
      store.entries();
    };

    public func fromStable(stableData : [(Text, Text)]) {
      store := HashMap.fromIter<Text, Text>(
        Iter.fromArray(stableData),
        stableData.size(),
        Text.equal,
        Text.hash,
      );
    };
  };
};
