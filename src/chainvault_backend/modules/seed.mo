import Random "mo:base/Random";

module {
  public func generateSeed() : async ?Nat {
    let seed = Random.Finite(await Random.blob());
    return seed.range(32);
  };
}