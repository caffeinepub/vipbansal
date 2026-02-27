import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Float "mo:core/Float";
import Storage "blob-storage/Storage";

module {
  type Coins = {
    usdt : Float;
    irn : Float;
  };

  type UserProfile = {
    userId : Nat;
    name : Text;
    username : Text;
    email : Text;
    balance : Coins;
    role : { #user; #admin };
  };

  type WithdrawRequest = {
    requestId : Nat;
    userId : Nat;
    amount : Text;
    upiId : Text;
    status : { #pending; #approved };
  };

  type OldSportCategory = {
    #Cricket;
    #Football;
    #Basketball;
    #Tennis;
  };

  type OldGame = {
    id : Nat;
    name : Text;
    category : OldSportCategory;
    thumbnail : Storage.ExternalBlob;
    description : Text;
    gameUrl : Text;
  };

  type PlayerScore = {
    username : Text;
    score : Nat;
    category : OldSportCategory;
  };

  type OldActor = {
    adminUsername : Text;
    nextUserId : Nat;
    nextRequestId : Nat;
    principalToUserId : Map.Map<Principal, Nat>;
    userProfiles : Map.Map<Nat, UserProfile>;
    withdrawRequests : Map.Map<Nat, WithdrawRequest>;
    nextGameId : Nat;
    games : Map.Map<Nat, OldGame>;
    playerScores : List.List<PlayerScore>;
  };

  type NewSportCategory = {
    #Cricket;
    #Football;
    #Basketball;
    #Tennis;
    #Racing;
    #Badminton;
    #Shooting;
  };

  type NewGame = {
    id : Nat;
    name : Text;
    category : NewSportCategory;
    thumbnail : Storage.ExternalBlob;
    description : Text;
    gameUrl : Text;
  };

  type NewPlayerScore = {
    username : Text;
    score : Nat;
    category : NewSportCategory;
  };

  type NewActor = {
    adminUsername : Text;
    nextUserId : Nat;
    nextRequestId : Nat;
    principalToUserId : Map.Map<Principal, Nat>;
    userProfiles : Map.Map<Nat, UserProfile>;
    withdrawRequests : Map.Map<Nat, WithdrawRequest>;
    nextGameId : Nat;
    games : Map.Map<Nat, NewGame>;
    playerScores : List.List<NewPlayerScore>;
  };

  type ExternalBlob = Storage.ExternalBlob;

  func convertOldSportCategory(oldCategory : OldSportCategory) : NewSportCategory {
    switch (oldCategory) {
      case (#Cricket) { #Cricket };
      case (#Football) { #Football };
      case (#Basketball) { #Basketball };
      case (#Tennis) { #Tennis };
    };
  };

  func convertOldGame(oldGame : OldGame) : NewGame {
    {
      oldGame with
      category = convertOldSportCategory(oldGame.category);
    };
  };

  func convertOldPlayerScore(oldScore : PlayerScore) : NewPlayerScore {
    {
      oldScore with
      category = convertOldSportCategory(oldScore.category);
    };
  };

  public func run(old : OldActor) : NewActor {
    let newGames = old.games.map<Nat, OldGame, NewGame>(
      func(_id, oldGame) {
        convertOldGame(oldGame);
      }
    );

    let newPlayerScores = old.playerScores.map<PlayerScore, NewPlayerScore>(
      func(oldScore) {
        convertOldPlayerScore(oldScore);
      }
    );

    {
      old with
      games = newGames;
      playerScores = newPlayerScores;
    };
  };
};
