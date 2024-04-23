package umm3601.startedHunt;

import static com.mongodb.client.model.Filters.eq;

import org.bson.UuidRepresentation;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;
import java.util.ArrayList;

import com.mongodb.client.MongoDatabase;

import io.javalin.Javalin;
import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import io.javalin.http.NotFoundResponse;
import umm3601.Controller;


//none of this will work until teamhunts is merged with main or merged into the branch

public class TeamHuntController implements Controller {
  private static final String API_TEAMHUNTS_BY_INVITE_CODE = "api/teamhunts/{invitecode}";

  static final String INVITE_CODE_KEY = "accessCode";
  static final String STARTED_HUNT_ID_KEY = "startedHuntId";

  private final JacksonMongoCollection<StartedHunt> startedHuntCollection;
  private final JacksonMongoCollection<TeamHunt> TeamHuntCollection;

    public TeamHuntController(MongoDatabase database) {

    startedHuntCollection = JacksonMongoCollection.builder().build(
        database,
        "startedHunts",
        StartedHunt.class,
        UuidRepresentation.STANDARD);

    TeamHuntCollection = JacksonMongoCollection.builder().build(
        database,
        "teamHunts",
        TeamHunt.class,
        UuidRepresentation.STANDARD);

    }

public void getTeamHuntsByInviteCode(Context ctx) {
  String inviteCode = ctx.pathParam("invitecode");
  StartedHunt startedHunt = startedHuntCollection.find(eq( INVITE_CODE_KEY, inviteCode )).first();

  if (startedHunt == null) {
    throw new NotFoundResponse("The requested startedHunt was not found " + inviteCode);
  }

  String startedHuntId = startedHunt._id;

  TeamHunt[] teamHuntsArray = getTeamHuntsByStartedHuntId(startedHuntId);

  ctx.json(teamHuntsArray);
  ctx.status(HttpStatus.OK);

}


private TeamHunt[] getTeamHuntsByStartedHuntId(String startedHuntId) {
  ArrayList<TeamHunt> teamHunts = TeamHuntCollection.find(eq(STARTED_HUNT_ID_KEY, startedHuntId)).into(new ArrayList<>());
  TeamHunt[] teamHuntsArray = (TeamHunt[]) teamHunts.toArray();
  return(teamHuntsArray);
}

@Override
  public void addRoutes(Javalin server) {
    server.get(API_TEAMHUNTS_BY_INVITE_CODE, this::getTeamHuntsByInviteCode);
  }
}
