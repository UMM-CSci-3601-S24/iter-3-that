package umm3601.startedHunt;

import io.javalin.Javalin;
import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import io.javalin.http.NotFoundResponse;
import umm3601.Controller;
import umm3601.hunt.Task;

import static com.mongodb.client.model.Filters.eq;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.bson.UuidRepresentation;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;

import com.mongodb.client.MongoDatabase;
import com.mongodb.client.result.DeleteResult;
import java.util.Base64;

public class StartedHuntController implements Controller {

  private static final String API_STARTED_HUNT = "/api/startedHunts/{accessCode}";
  private static final String API_TEAM_HUNTS = "/api/teamHunts";
  private static final String API_TEAM_HUNT = "/api/teamHunts/{id}";
  private static final String API_END_HUNT = "/api/endHunt/{id}";
  private static final String API_ENDED_HUNT = "/api/endedHunts/{id}";
  private static final String API_ENDED_HUNTS = "/api/hosts/{id}/endedHunts";
  private static final String API_DELETE_HUNT = "/api/endedHunts/{id}";
  private static final String API_PHOTO_UPLOAD = "/api/teamHunt/{teamHuntId}/tasks/{taskId}/photo";

  private static final int ACCESS_CODE_LENGTH = 6;
  private static final int REASONABLE_TEAM_NAME_LENGTH = 50;
  private static final int REASONABLE_AMOUNT_OF_MEMBERS = 20;

  private final JacksonMongoCollection<StartedHunt> startedHuntCollection;
  private final JacksonMongoCollection<TeamHunt> teamHuntCollection;

  public StartedHuntController(MongoDatabase database) {
    teamHuntCollection = JacksonMongoCollection.builder().build(
        database,
        "teamHunts",
        TeamHunt.class,
        UuidRepresentation.STANDARD);

    startedHuntCollection = JacksonMongoCollection.builder().build(
        database,
        "startedHunts",
        StartedHunt.class,
        UuidRepresentation.STANDARD);

    File directory = new File("photos");
    if (!directory.exists()) {
      directory.mkdir();
    }

  }

  public StartedHunt getStartedHunt(Context ctx) {
    String accessCode = ctx.pathParam("accessCode");
    StartedHunt startedHunt;

    // Validate the access code
    if (accessCode.length() != ACCESS_CODE_LENGTH || !accessCode.matches("\\d+")) {
      ctx.status(HttpStatus.BAD_REQUEST);
      throw new BadRequestResponse("The requested access code is not a valid access code.");
    }

    startedHunt = startedHuntCollection.find(eq("accessCode", accessCode)).first();

    if (startedHunt == null) {
      ctx.status(HttpStatus.NOT_FOUND);
      throw new NotFoundResponse("The requested access code was not found.");
    } else if (!startedHunt.status) {
      ctx.status(HttpStatus.BAD_REQUEST);
      throw new BadRequestResponse("The requested hunt is no longer joinable.");
    } else {
      ctx.json(startedHunt);
      ctx.status(HttpStatus.OK);
      return startedHunt;
    }
  }

  public void getEndedHunts(Context ctx) {
    List<StartedHunt> endedHunts = startedHuntCollection.find(eq("status", false)).into(new ArrayList<>());
    ctx.json(endedHunts);
    ctx.status(HttpStatus.OK);
  }

  public void endStartedHunt(Context ctx) {
    String id = ctx.pathParam("id");
    StartedHunt startedHunt = startedHuntCollection.find(eq("_id", new ObjectId(id))).first();

    if (startedHunt == null) {
      throw new NotFoundResponse("The requested started hunt was not found.");
    } else {
      startedHunt.status = false;
      startedHunt.accessCode = "1";
      startedHunt.endDate = new Date();
      startedHuntCollection.save(startedHunt);
      ctx.status(HttpStatus.OK);
    }
  }

  public void deleteStartedHunt(Context ctx) {
    String id = ctx.pathParam("id");
    DeleteResult deleteResult = startedHuntCollection.deleteOne(eq("_id", new ObjectId(id)));
    if (deleteResult.getDeletedCount() != 1) {
      ctx.status(HttpStatus.NOT_FOUND);
      throw new NotFoundResponse(
          "Was unable to delete ID "
              + id
              + "; perhaps illegal ID or an ID for an item not in the system?");
    }
    ctx.status(HttpStatus.OK);

    for (TeamHunt teamHunt : teamHuntCollection.find(eq("startedHuntId", id)).into(new ArrayList<>())) {
      for (Task task : teamHunt.tasks) {
        if (task.photo.length() > 0) {
          deletePhoto(task.photo, ctx);
        }
      }
      deleteTeamHunt(teamHunt._id);
    }
  }

  public void makeTeamHunt(Context ctx) {
    TeamHunt newTeamHunt = ctx.bodyValidator(TeamHunt.class)
        .check(teamHunt -> teamHunt.startedHuntId != null && teamHunt.startedHuntId.length() > 0, "Invalid ID")
        .check(teamHunt -> teamHunt.teamName.length() <= REASONABLE_TEAM_NAME_LENGTH,
            "Team name must be 50 characters or less")
        .check(teamHunt -> teamHunt.teamName.length() > 0, "Team name must be at least 1 character")
        .check(teamHunt -> teamHunt.members.size() <= REASONABLE_AMOUNT_OF_MEMBERS, "Too many members")
        .check(teamHunt -> teamHunt.members.size() > 0, "Must have at least one member")
        .get();

    StartedHunt startedHunt = startedHuntCollection.find(eq("_id", new ObjectId(newTeamHunt.startedHuntId))).first();
    if (startedHunt == null) {
      ctx.status(HttpStatus.NOT_FOUND);
      throw new BadRequestResponse("StartedHunt with ID " + newTeamHunt.startedHuntId + " does not exist");
    }

    if (!startedHunt.status) {
      ctx.status(HttpStatus.BAD_REQUEST);
      throw new BadRequestResponse("The hunt has already ended");
    }

    if (startedHunt.teamsLeft == 0) {
      ctx.status(HttpStatus.BAD_REQUEST);
      throw new BadRequestResponse("The hunt is full");
    }

    startedHunt.teamsLeft--;
    startedHuntCollection.save(startedHunt);
    newTeamHunt.tasks = startedHunt.completeHunt.tasks;

    teamHuntCollection.insertOne(newTeamHunt);
    ctx.json(Map.of("id", newTeamHunt._id));
    ctx.status(HttpStatus.CREATED);
  }

  public void getTeamHunt(Context ctx) {
    String id = ctx.pathParam("id");
    TeamHunt teamHunt;

    try {
      teamHunt = teamHuntCollection.find(eq("_id", new ObjectId(id))).first();
    } catch (IllegalArgumentException e) {
      ctx.status(HttpStatus.BAD_REQUEST);
      throw new BadRequestResponse("The requested team id '" + id + "' wasn't a legal Mongo Object ID.");
    }
    if (teamHunt == null) {
      ctx.status(HttpStatus.NOT_FOUND);
      throw new NotFoundResponse("The requested team hunt with id '" + id + "' was not found");
    }
    ctx.json(teamHunt);
    ctx.status(HttpStatus.OK);
  }

  public void deleteTeamHunt(String id) {
    DeleteResult deleteResult = teamHuntCollection.deleteOne(eq("_id", new ObjectId(id)));
    if (deleteResult.getDeletedCount() != 1) {
      throw new NotFoundResponse(
          "Was unable to delete team hunt with ID "
              + id
              + "; perhaps illegal ID or an ID for an item not in the system?");
    }
  }

  public void addPhoto(Context ctx) {
    String id = uploadPhoto(ctx);
    addPhotoPathToTask(ctx, id);
    ctx.status(HttpStatus.CREATED);
    ctx.json(Map.of("id", id));
  }

  public String getFileExtension(String filename) {
    int dotIndex = filename.lastIndexOf('.');
    if (dotIndex >= 0) {
      return filename.substring(dotIndex + 1);
    } else {
      return "";
    }
  }

  public String uploadPhoto(Context ctx) {
    var uploadedFile = ctx.uploadedFile("photo");
    if (uploadedFile == null) {
      throw new BadRequestResponse("No photo uploaded");
    }
    try (InputStream in = uploadedFile.content()) {

      String id = UUID.randomUUID().toString();

      String extension = getFileExtension(uploadedFile.filename());
      File file = Path.of("photos", id + "." + extension).toFile();
      System.err.println("The path was " + file.toPath());

      Files.copy(in, file.toPath(), StandardCopyOption.REPLACE_EXISTING);
      ctx.status(HttpStatus.OK);
      return id + "." + extension;
    } catch (RuntimeException | IOException e) {
      System.err.println("Error copying the uploaded file: " + e);
      throw new BadRequestResponse("Error handling the uploaded file: " + e.getMessage());
    }
  }

  public void addPhotoPathToTask(Context ctx, String photoPath) {
    String taskId = ctx.pathParam("taskId");
    String teamHuntId = ctx.pathParam("teamHuntId");
    TeamHunt teamHunt = teamHuntCollection.find(eq("_id", new ObjectId(teamHuntId))).first();
    if (teamHunt == null) {
      ctx.status(HttpStatus.NOT_FOUND);
      throw new BadRequestResponse("StartedHunt with ID " + teamHuntId + " does not exist");
    }

    Task task = teamHunt.tasks.stream().filter(t -> t._id.equals(taskId)).findFirst().orElse(null);

    if (task == null) {
      ctx.status(HttpStatus.NOT_FOUND);
      throw new BadRequestResponse("Task with ID " + taskId + " does not exist");
    }

    if (task.photo.length() > 0) {
      deletePhoto(task.photo, ctx);
    }

    task.photo = photoPath.toString();
    teamHunt.tasks.set(teamHunt.tasks.indexOf(task), task);
    teamHuntCollection.save(teamHunt);
  }

  public void deletePhoto(String id, Context ctx) {
    Path filePath = Path.of("photos/" + id);
    if (!Files.exists(filePath)) {
      ctx.status(HttpStatus.NOT_FOUND);
      throw new BadRequestResponse("Photo with ID " + id + " does not exist");
    }

    try {
      Files.delete(filePath);

      ctx.status(HttpStatus.OK);
    } catch (IOException e) {
      ctx.status(HttpStatus.INTERNAL_SERVER_ERROR);
      throw new BadRequestResponse("Error deleting the photo: " + e.getMessage());
    }
  }

  public void getEndedHunt(Context ctx) {
    EndedHunt endedHunt = new EndedHunt();
    endedHunt.finishedTasks = new ArrayList<>();
    endedHunt.teamHunts = teamHuntCollection.find(eq("startedHuntId", ctx.pathParam("id"))).into(new ArrayList<>());
    for (TeamHunt teamHunt : endedHunt.teamHunts) {
      endedHunt.finishedTasks.addAll(getFinishedTasks(teamHunt.tasks));
    }

    ctx.json(endedHunt);
    ctx.status(HttpStatus.OK);
  }

  public StartedHunt getStartedHuntById(Context ctx) {
    String id = ctx.pathParam("id");
    StartedHunt startedHunt;

    try {
      startedHunt = startedHuntCollection.find(eq("_id", new ObjectId(id))).first();
    } catch (IllegalArgumentException e) {
      throw new BadRequestResponse("The requested started hunt id wasn't a legal Mongo Object ID.");
    }
    if (startedHunt == null) {
      throw new NotFoundResponse("The requested started hunt was not found");
    } else {
      return startedHunt;
    }
  }

  public List<FinishedTask> getFinishedTasks(List<Task> tasks) {
    ArrayList<FinishedTask> finishedTasks = new ArrayList<>();
    FinishedTask finishedTask;
    for (Task task : tasks) {
      finishedTask = new FinishedTask();
      finishedTask.taskId = task._id;
      finishedTask.photo = getPhotoFromTask(task);
      finishedTasks.add(finishedTask);
    }
    return finishedTasks;
  }

  public String getPhotoFromTask(Task task) {
    String encodedPhoto = "";
    File photo = new File("photos/" + task.photo);
    if (photo.exists()) {
      try {
        byte[] bytes = Files.readAllBytes(Paths.get(photo.getPath()));
        String encoded = "data:image/png;base64," + Base64.getEncoder().encodeToString(bytes);
        encodedPhoto = encoded;
      } catch (IOException e) {
        e.printStackTrace();
      }
    }
    return encodedPhoto;
  }

  @Override
  public void addRoutes(Javalin server) {
    server.get(API_STARTED_HUNT, this::getStartedHunt);
    server.put(API_END_HUNT, this::endStartedHunt);
    server.post(API_PHOTO_UPLOAD, this::addPhoto);
    server.get(API_ENDED_HUNT, this::getEndedHunt);
    server.get(API_ENDED_HUNTS, this::getEndedHunts);
    server.delete(API_DELETE_HUNT, this::deleteStartedHunt);
    server.post(API_TEAM_HUNTS, this::makeTeamHunt);
    server.get(API_TEAM_HUNT, this::getTeamHunt);
  }
}
