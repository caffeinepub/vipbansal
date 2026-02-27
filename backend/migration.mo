import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Storage "blob-storage/Storage";
import Principal "mo:core/Principal";

module {
  type OldSportsGame = {
    id : Nat;
    name : Text;
    category : {
      #Cricket;
      #Football;
      #Basketball;
      #Tennis;
    };
    thumbnail : Storage.ExternalBlob;
    description : Text;
  };

  type OldActor = {
    nextGameId : Nat;
    games : Map.Map<Nat, OldSportsGame>;
    playerScores : List.List<{ username : Text; score : Nat; category : { #Cricket; #Football; #Basketball; #Tennis } }>;
    userProfiles : Map.Map<Principal, { principal : Principal; username : Text; email : Text }>;
    adminPrincipal : Principal;
  };

  type NewGame = {
    id : Nat;
    name : Text;
    category : {
      #Cricket;
      #Football;
      #Basketball;
      #Tennis;
    };
    thumbnail : Storage.ExternalBlob;
    description : Text;
    gameUrl : Text;
  };

  type NewActor = {
    nextGameId : Nat;
    games : Map.Map<Nat, NewGame>;
    playerScores : List.List<{ username : Text; score : Nat; category : { #Cricket; #Football; #Basketball; #Tennis } }>;
    userProfiles : Map.Map<Principal, { principal : Principal; username : Text; email : Text }>;
    adminPrincipal : Principal;
  };

  public func run(old : OldActor) : NewActor {
    let newGames = old.games.map<Nat, OldSportsGame, NewGame>(
      func(_, oldGame) {
        { oldGame with gameUrl = "" };
      }
    );
    {
      old with
      games = newGames;
    };
  };
};
