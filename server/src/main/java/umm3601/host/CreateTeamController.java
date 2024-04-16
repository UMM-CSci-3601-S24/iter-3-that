import io.javalin.Javalin;
import io.javalin.apibuilder.ApiBuilder;
import io.javalin.http.Handler;
import io.javalin.http.BadRequestResponse;

import org.bson.UuidRepresentation;
import org.eclipse.jetty.http.HttpStatus;
import org.mongojack.JacksonMongoCollection;
import com.mongodb.client.MongoDatabase;

import umm3601.Controller;
import umm3601.startedHunt.TeamHunt;

public class CreateTeamController implements Controller {

  private JacksonMongoCollection<TeamHunt> teamCollection;

  public CreateTeamController(MongoDatabase database) {
    teamCollection = JacksonMongoCollection.builder()
        .build(database, TeamHunt.class, UuidRepresentation.STANDARD);
  }

  @Override
  public void addRoutes(Javalin app) {
    app.routes(() -> {
      ApiBuilder.post("/api/teams", createTeam);
    });
  }

  public Handler createTeam = ctx -> {
    TeamHunt newTeam = ctx.bodyAsClass(TeamHunt.class);

    if (newTeam.getTeamName() == null || newTeam.getMemberNames() == null) {
      throw new BadRequestResponse("The team name and member names must not be null");
    }

    teamCollection.insertOne(newTeam);
    ctx.status(HttpStatus.CREATED_201).json(newTeam);
  };

}
