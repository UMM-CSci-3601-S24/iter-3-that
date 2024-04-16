import io.javalin.apibuilder.ApiBuilder;
import io.javalin.http.Handler;
import io.javalin.http.BadRequestResponse;
import org.eclipse.jetty.http.HttpStatus;
import com.mongodb.MongoDatabase;
import org.mongojack.JacksonMongoCollection;
import umm3601.Controller;

public class CreateTeamController implements Controller {

  private JacksonMongoCollection<Team> teamCollection;

  public CreateTeamController(MongoDatabase database) {
    teamCollection = JacksonMongoCollection.builder().build(database, "teams", Team.class);
  }

  @Override
  public void registerRoutes(Javalin app) {
    app.routes(() -> {
      ApiBuilder.post("/api/teams", createTeam);
    });
  }

  public Handler createTeam = ctx -> {
    Team newTeam = ctx.bodyAsClass(Team.class);

    if (newTeam.getTeamName() == null || newTeam.getMemberNames() == null) {
      throw new BadRequestResponse("The team name and member names must not be null");
    }

    teamCollection.insertOne(newTeam);
    ctx.status(HttpStatus.CREATED_201).json(newTeam);
  };
}
