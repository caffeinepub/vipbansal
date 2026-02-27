import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Map "mo:core/Map";
import Text "mo:core/Text";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Migration "migration";

(with migration = Migration.run)
actor {
  include MixinStorage();
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type SportCategory = {
    #Cricket;
    #Football;
    #Basketball;
    #Tennis;
  };

  type Game = {
    id : Nat;
    name : Text;
    category : SportCategory;
    thumbnail : Storage.ExternalBlob;
    description : Text;
    gameUrl : Text;
  };

  type PlayerScore = {
    username : Text;
    score : Nat;
    category : SportCategory;
  };

  module PlayerScore {
    public func compare(player1 : PlayerScore, player2 : PlayerScore) : Order.Order {
      switch (Nat.compare(player2.score, player1.score)) {
        case (#equal) { Text.compare(player1.username, player2.username) };
        case (order) { order };
      };
    };
  };

  type UserProfile = {
    principal : Principal;
    username : Text;
    email : Text;
  };

  var nextGameId = 1;
  var games = Map.empty<Nat, Game>();
  var playerScores = List.empty<PlayerScore>();
  var userProfiles = Map.empty<Principal, UserProfile>();
  stable let adminPrincipal : Principal = Principal.fromText("2vxsx-fae");

  // --- Required profile interface for frontend ---
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // --- User Profile Functions ---
  public shared ({ caller }) func registerUser(username : Text, email : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can register");
    };

    if (username.isEmpty() or email.isEmpty()) {
      Runtime.trap("Username and email cannot be empty");
    };

    if (userProfiles.containsKey(caller)) {
      Runtime.trap("User already registered with this principal");
    };

    let newUser : UserProfile = {
      principal = caller;
      username;
      email;
    };
    userProfiles.add(caller, newUser);
  };

  public query ({ caller }) func getMyProfile() : async UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their profile");
    };

    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("No profile found for caller") };
      case (?profile) { profile };
    };
  };

  public shared ({ caller }) func updateProfile(newUsername : Text, newEmail : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update their profile");
    };

    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("No profile found to update") };
      case (?existingProfile) {
        let updatedProfile : UserProfile = {
          principal = caller;
          username = newUsername;
          email = newEmail;
        };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  // --- Game Management ---
  public shared ({ caller }) func addGame(name : Text, category : SportCategory, thumbnail : Storage.ExternalBlob, description : Text, gameUrl : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add games");
    };

    let game : Game = {
      id = nextGameId;
      name;
      category;
      thumbnail;
      description;
      gameUrl;
    };

    games.add(nextGameId, game);
    nextGameId += 1;
  };

  public query func getAllGames() : async [Game] {
    games.values().toArray();
  };

  public query func getGameById(id : Nat) : async Game {
    switch (games.get(id)) {
      case (null) { Runtime.trap("Game not found") };
      case (?game) { game };
    };
  };

  // --- Leaderboard Management ---
  public shared ({ caller }) func addPlayerScore(username : Text, score : Nat, category : SportCategory) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can submit scores");
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not registered") };
      case (_) {
        let playerScore : PlayerScore = {
          username;
          score;
          category;
        };
        playerScores.add(playerScore);
      };
    };
  };

  public query func getTopScores() : async [PlayerScore] {
    playerScores.values().toArray().sort();
  };

  // === ADMIN SYSTEM ===

  public query ({ caller }) func isAdmin() : async Bool {
    caller == adminPrincipal;
  };

  public query ({ caller }) func getAllUsers() : async [UserProfile] {
    if (caller != adminPrincipal) {
      Runtime.trap("Unauthorized: Only admins can access all user profiles");
    };
    userProfiles.values().toArray();
  };

  public shared ({ caller }) func deleteUser(user : Principal) : async () {
    if (caller != adminPrincipal) {
      Runtime.trap("Unauthorized: Only admins can delete user profiles");
    };

    switch (userProfiles.get(user)) {
      case (null) { Runtime.trap("No profile found to delete") };
      case (_) {
        userProfiles.remove(user);
      };
    };
  };

  public shared ({ caller }) func updateUserProfile(user : Principal, newUsername : Text, newEmail : Text) : async () {
    if (caller != adminPrincipal) {
      Runtime.trap("Unauthorized: Only admins can update user profiles");
    };

    switch (userProfiles.get(user)) {
      case (null) { Runtime.trap("No profile found to update") };
      case (_) {
        let updatedProfile : UserProfile = {
          principal = user;
          username = newUsername;
          email = newEmail;
        };
        userProfiles.add(user, updatedProfile);
      };
    };
  };

  public shared ({ caller }) func resetUserData(user : Principal) : async () {
    if (caller != adminPrincipal) {
      Runtime.trap("Unauthorized: Only admins can reset user data");
    };

    let userText = user.toText();
    let remainingScores = List.fromIter<PlayerScore>(
      playerScores.values().filter(func(score : PlayerScore) : Bool { score.username != userText })
    );
    playerScores := remainingScores;
  };
};
