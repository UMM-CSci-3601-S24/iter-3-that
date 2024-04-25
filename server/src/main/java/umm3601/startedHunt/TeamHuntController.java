package umm3601.startedHunt;

import static com.mongodb.client.model.Filters.eq;

import org.bson.UuidRepresentation;
// import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;
import java.util.ArrayList;


import java.util.HashMap;
import java.util.Iterator;
import java.util.concurrent.TimeUnit;

import com.mongodb.client.MongoDatabase;

import io.javalin.Javalin;
// import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import io.javalin.http.NotFoundResponse;
import io.javalin.websocket.WsContext;
import umm3601.Controller;



//none of this will work until teamhunts is merged with main or merged into the branch

public class TeamHuntController implements Controller {
  private static final String API_TEAMHUNTS_BY_INVITE_CODE = "api/teamHunts/{invitecode}";
  private static final String TEAMHUNT_UPDATES_WEBSOCKET = "ws/teamHunts/{startedhuntid}";

  static final String INVITE_CODE_KEY = "accessCode";
  static final String STARTED_HUNT_ID_KEY = "startedHuntId";

  int second_to_ping = 5;

  //the string value that is associated with the WsContexts is the started HuntId that all team hunts can be gotten from
  //put there for ease of access in functions
  private HashMap<WsContext, String> connectedContextsDictionary = new HashMap<WsContext, String>();

  private final JacksonMongoCollection<StartedHunt> startedHuntCollection;
  private final JacksonMongoCollection<TeamHunt> teamHuntCollection;

    public TeamHuntController(MongoDatabase database) {

    startedHuntCollection = JacksonMongoCollection.builder().build(
        database,
        "startedHunts",
        StartedHunt.class,
        UuidRepresentation.STANDARD);

    teamHuntCollection = JacksonMongoCollection.builder().build(
        database,
        "teamHunts",
        TeamHunt.class,
        UuidRepresentation.STANDARD);

    }

public void getTeamHuntsByInviteCode(Context ctx) {
  String inviteCode = ctx.pathParam("invitecode");
  StartedHunt startedHunt = startedHuntCollection.find( eq( INVITE_CODE_KEY, inviteCode ) ).first();

  if (startedHunt == null) {
    throw new NotFoundResponse("The requested startedHunt was not found " + inviteCode);
  }

  String startedHuntId = startedHunt._id.toString();

  TeamHunt[] teamHuntsArray = getTeamHuntsByStartedHuntId(startedHuntId);

  //System.err.println("teamHunt names " + teamHuntsArray[1].teamName);

  ctx.json(teamHuntsArray);
  ctx.status(HttpStatus.OK);

}


private TeamHunt[] getTeamHuntsByStartedHuntId(String startedHuntId) {

  ArrayList<TeamHunt> teamHunts = teamHuntCollection.find(eq(STARTED_HUNT_ID_KEY, startedHuntId))
  .into(new ArrayList<>());

  TeamHunt[] teamHuntsArray = teamHunts.toArray(new TeamHunt[0]);
  //System.err.println("teamHunt names in privet method" + teamHuntsArray[1].teamName);
  return (teamHuntsArray);
}


private void updateTeamHuntsViaWebsocket(String startedHuntId) {
  Iterator<WsContext> iterator = connectedContextsDictionary.keySet().iterator(); //  connectedContexts.iterator();
  while (iterator.hasNext()) {
    WsContext ws = iterator.next();
    if (ws.session.isOpen()) {
      String associatedStartedHuntID = connectedContextsDictionary.get(ws);
      if (associatedStartedHuntID.equals(startedHuntId)) {
        TeamHunt[] teamHuntsArray = getTeamHuntsByStartedHuntId(startedHuntId);
        ws.send(teamHuntsArray);
      } else {
        iterator.remove();
      }
    }
  }
}

public void addRoutes(Javalin server) {
  //get all teamhunts for a started hunt
  server.get(API_TEAMHUNTS_BY_INVITE_CODE, this::getTeamHuntsByInviteCode);

  //get live updates of teamhunts and task progress
  server.ws(TEAMHUNT_UPDATES_WEBSOCKET, ws -> {
    ws.onConnect(ctx -> {
      String startedHuntId = ctx.pathParam("startedhuntid");
      connectedContextsDictionary.put(ctx, startedHuntId);
      ctx.enableAutomaticPings(second_to_ping, TimeUnit.SECONDS);
    });
  });
}


}
