import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Migration "migration";

import Text "mo:core/Text";

import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Float "mo:core/Float";

(with migration = Migration.run)
actor {
  include MixinStorage();
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let adminUsername : Text = "survesh1";

  var nextUserId = 161056835;
  var nextRequestId = 1;

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

  module UserProfile {
    public func new(userId : Nat, name : Text, username : Text, email : Text, role : { #user; #admin }) : UserProfile {
      {
        userId;
        name;
        username;
        email;
        balance = { usdt = 0.0; irn = 0.0 };
        role;
      };
    };
  };

  // Map from Principal to userId for caller-based lookups
  var principalToUserId = Map.empty<Principal, Nat>();
  var userProfiles = Map.empty<Nat, UserProfile>();

  // Seed the admin user profile if not already present
  do {
    if (userProfiles.get(161056834) == null) {
      let adminProfile : UserProfile = {
        userId = 161056834;
        name = "survesh bansal";
        username = adminUsername;
        email = "mjkjbansal@gmail.com";
        balance = { usdt = 0.0; irn = 0.0 };
        role = #admin;
      };
      userProfiles.add(161056834, adminProfile);
    };
  };

  type WithdrawRequest = {
    requestId : Nat;
    userId : Nat;
    amount : Text;
    upiId : Text;
    status : { #pending; #approved };
  };

  module WithdrawRequest {
    public func new(requestId : Nat, userId : Nat, amount : Text, upiId : Text) : WithdrawRequest {
      {
        requestId;
        userId;
        amount;
        upiId;
        status = #pending;
      };
    };
  };

  var withdrawRequests = Map.empty<Nat, WithdrawRequest>();

  type SportCategory = {
    #Cricket;
    #Football;
    #Basketball;
    #Tennis;
    #Racing;
    #Badminton;
    #Shooting;
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

  var nextGameId = 7;
  var games = Map.empty<Nat, Game>();
  var playerScores = List.empty<PlayerScore>();

  // Pre-populate new game categories
  do {
    // Racing Games
    let racingGame1 : Game = {
      id = 1;
      name = "Speed Rush";
      category = #Racing;
      thumbnail = "https://images.unsplash.com/photo-1511919884226-fd3cad34687c";
      description = "High-speed racing action. Dodge obstacles and beat your best time!";
      gameUrl = "https://example.com/racing/speed-rush";
    };
    let racingGame2 : Game = {
      id = 2;
      name = "City Drifter";
      category = #Racing;
      thumbnail = "https://images.unsplash.com/photo-1517821362973-3294f3ef2455";
      description = "Race through city streets and master sharp turns!";
      gameUrl = "https://example.com/racing/city-drifter";
    };

    // Badminton Games
    let badmintonGame1 : Game = {
      id = 3;
      name = "Shuttle Smash";
      category = #Badminton;
      thumbnail = "https://images.unsplash.com/photo-1506744038136-46273834b3fb";
      description = "Test your badminton skills with fast-paced rallies!";
      gameUrl = "https://example.com/badminton/shuttle-smash";
    };
    let badmintonGame2 : Game = {
      id = 4;
      name = "Net Play Master";
      category = #Badminton;
      thumbnail = "https://images.unsplash.com/photo-1482062364825-616fd23b8fc1";
      description = "Become a net play specialist in this pro-level badminton game!";
      gameUrl = "https://example.com/badminton/net-play-master";
    };

    // Shooting Games
    let shootingGame1 : Game = {
      id = 5;
      name = "Sharp Shooter";
      category = #Shooting;
      thumbnail = "https://images.unsplash.com/photo-1519125323398-675f0ddb6308";
      description = "Test your aim and speed in this action-packed shooting game!";
      gameUrl = "https://example.com/shooting/sharp-shooter";
    };
    let shootingGame2 : Game = {
      id = 6;
      name = "Target Practice";
      category = #Shooting;
      thumbnail = "https://images.unsplash.com/photo-1464983953574-0892a716854b";
      description = "Become a marksmanship expert with challenging targets!";
      gameUrl = "https://example.com/shooting/target-practice";
    };

    // Add pre-populated games to the games map
    games.add(1, racingGame1);
    games.add(2, racingGame2);
    games.add(3, badmintonGame1);
    games.add(4, badmintonGame2);
    games.add(5, shootingGame1);
    games.add(6, shootingGame2);
  };

  // --- Required profile interface for frontend ---

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their profile");
    };
    switch (principalToUserId.get(caller)) {
      case (null) { null };
      case (?uid) { userProfiles.get(uid) };
    };
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save profiles");
    };
    // Only allow updating own profile; role cannot be escalated by user
    switch (principalToUserId.get(caller)) {
      case (null) { Runtime.trap("No profile registered for caller") };
      case (?uid) {
        if (uid != profile.userId) {
          Runtime.trap("Unauthorized: Cannot save another user's profile");
        };
        switch (userProfiles.get(uid)) {
          case (null) { Runtime.trap("Profile not found") };
          case (?existing) {
            // Preserve role — users cannot change their own role
            let safeProfile : UserProfile = {
              userId = existing.userId;
              name = profile.name;
              username = profile.username;
              email = profile.email;
              balance = existing.balance;
              role = existing.role;
            };
            userProfiles.add(uid, safeProfile);
          };
        };
      };
    };
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    switch (principalToUserId.get(user)) {
      case (null) { null };
      case (?uid) { userProfiles.get(uid) };
    };
  };

  // --- Extended User Profile Functions ---

  public shared ({ caller }) func registerUser(name : Text, username : Text, email : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can register");
    };

    if (name == "") {
      Runtime.trap("Name cannot be empty");
    };
    if (username == "") {
      Runtime.trap("Username cannot be empty");
    };
    if (email == "") {
      Runtime.trap("Email cannot be empty");
    };

    if (principalToUserId.get(caller) != null) {
      Runtime.trap("Caller already has a registered profile");
    };

    if (userProfiles.values().any(func(profile : UserProfile) : Bool { profile.username == username })) {
      Runtime.trap("Username already taken");
    };

    let newUser = UserProfile.new(nextUserId, name, username, email, #user);
    userProfiles.add(nextUserId, newUser);
    principalToUserId.add(caller, nextUserId);
    nextUserId += 1;
  };

  public query ({ caller }) func getMyProfile(userId : Nat) : async UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their profile");
    };

    // Verify caller owns this profile
    switch (principalToUserId.get(caller)) {
      case (null) { Runtime.trap("Caller has no registered profile") };
      case (?uid) {
        if (uid != userId and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Cannot view another user's profile");
        };
      };
    };

    switch (userProfiles.get(userId)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) { profile };
    };
  };

  public shared ({ caller }) func updateProfile(userId : Nat, newName : Text, newUsername : Text, newEmail : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update their profile");
    };

    // Verify caller owns this profile (admins can also update)
    switch (principalToUserId.get(caller)) {
      case (null) { Runtime.trap("Caller has no registered profile") };
      case (?uid) {
        if (uid != userId and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Cannot update another user's profile");
        };
      };
    };

    switch (userProfiles.get(userId)) {
      case (null) { Runtime.trap("Cannot update: Profile does not exist") };
      case (?existingProfile) {
        if (userProfiles.values().any(func(profile : UserProfile) : Bool { profile.username == newUsername and profile.userId != userId })) {
          Runtime.trap("Username already taken");
        };

        let updatedProfile : UserProfile = {
          userId;
          name = newName;
          username = newUsername;
          email = newEmail;
          balance = existingProfile.balance;
          role = existingProfile.role;
        };
        userProfiles.add(userId, updatedProfile);
      };
    };
  };

  public query ({ caller }) func getAllUsers() : async [UserProfile] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can fetch all users");
    };
    userProfiles.values().toArray();
  };

  public shared ({ caller }) func updateUserProfile(userId : Nat, newName : Text, newUsername : Text, newEmail : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update user profiles");
    };

    switch (userProfiles.get(userId)) {
      case (null) { Runtime.trap("Cannot update: Profile does not exist") };
      case (?existingProfile) {
        if (userProfiles.values().any(func(profile : UserProfile) : Bool { profile.username == newUsername and profile.userId != userId })) {
          Runtime.trap("Username already taken");
        };

        let updatedProfile : UserProfile = {
          userId;
          name = newName;
          username = newUsername;
          email = newEmail;
          balance = existingProfile.balance;
          role = existingProfile.role;
        };
        userProfiles.add(userId, updatedProfile);
      };
    };
  };

  // --- Withdraw Request System ---

  public shared ({ caller }) func submitWithdrawRequest(userId : Nat, amount : Text, upiId : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can submit withdraw requests");
    };

    // Verify caller owns this userId
    switch (principalToUserId.get(caller)) {
      case (null) { Runtime.trap("Caller has no registered profile") };
      case (?uid) {
        if (uid != userId and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Cannot submit withdraw request for another user");
        };
      };
    };

    if (not amount.startsWith(#text "₹")) {
      Runtime.trap("Amount must start with '₹'");
    };

    if (upiId == "") {
      Runtime.trap("UPI ID cannot be empty");
    };

    switch (userProfiles.get(userId)) {
      case (null) { Runtime.trap("User does not exist") };
      case (_) {
        let newRequest = WithdrawRequest.new(nextRequestId, userId, amount, upiId);
        withdrawRequests.add(nextRequestId, newRequest);
        nextRequestId += 1;
        newRequest.requestId;
      };
    };
  };

  public query ({ caller }) func getAllWithdrawRequests() : async [WithdrawRequest] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all withdraw requests");
    };
    withdrawRequests.values().toArray();
  };

  public shared ({ caller }) func approveWithdrawRequest(requestId : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can approve withdraw requests");
    };

    switch (withdrawRequests.get(requestId)) {
      case (null) { Runtime.trap("Withdraw request not found") };
      case (?existingRequest) {
        let approvedRequest : WithdrawRequest = {
          requestId;
          userId = existingRequest.userId;
          amount = existingRequest.amount;
          upiId = existingRequest.upiId;
          status = #approved;
        };
        withdrawRequests.add(requestId, approvedRequest);
      };
    };
  };

  public shared ({ caller }) func deleteWithdrawRequest(requestId : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete withdraw requests");
    };

    switch (withdrawRequests.get(requestId)) {
      case (null) { Runtime.trap("Withdraw request not found") };
      case (_) {
        withdrawRequests.remove(requestId);
      };
    };
  };

  // --- Game Management ---

  public shared ({ caller }) func addGame(name : Text, category : SportCategory, thumbnail : Storage.ExternalBlob, description : Text, gameUrl : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
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
    if (not userProfiles.values().any(func(profile : UserProfile) : Bool { profile.username == username })) {
      Runtime.trap("User not registered");
    };
    let playerScore : PlayerScore = {
      username;
      score;
      category;
    };
    playerScores.add(playerScore);
  };

  public query func getTopScores() : async [PlayerScore] {
    playerScores.values().toArray().sort();
  };

  // === ADMIN SYSTEM ===

  public query ({ caller }) func isAdminCaller() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };
};
