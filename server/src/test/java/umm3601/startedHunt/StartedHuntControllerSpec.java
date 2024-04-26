package umm3601.startedHunt;

import static com.mongodb.client.model.Filters.eq;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import io.javalin.Javalin;
import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import io.javalin.http.NotFoundResponse;
import io.javalin.http.UploadedFile;
import io.javalin.json.JavalinJackson;
import io.javalin.validation.BodyValidator;
import io.javalin.validation.ValidationException;
import umm3601.hunt.CompleteHunt;
import umm3601.hunt.Hunt;
import umm3601.hunt.Task;
import static com.mongodb.client.model.Updates.set; // Import the necessary package

@SuppressWarnings({ "MagicNumber" })
class StartedHuntControllerSpec {
  private StartedHuntController startedHuntController;
  private ObjectId frysId;
  private ObjectId huntId;
  private ObjectId taskId;
  private ObjectId startedHuntId;
  private ObjectId teamHuntId;

  private static MongoClient mongoClient;
  private static MongoDatabase db;
  private static JavalinJackson javalinJackson = new JavalinJackson();

  @Mock
  private Context ctx;

  @Captor
  private ArgumentCaptor<ArrayList<Hunt>> huntArrayListCaptor;

  @Captor
  private ArgumentCaptor<ArrayList<Task>> taskArrayListCaptor;

  @Captor
  private ArgumentCaptor<CompleteHunt> completeHuntCaptor;

  @Captor
  private ArgumentCaptor<StartedHunt> startedHuntCaptor;

  @Captor
  private ArgumentCaptor<ArrayList<StartedHunt>> startedHuntArrayListCaptor;

  @Captor
  private ArgumentCaptor<EndedHunt> finishedHuntCaptor;

  @Captor
  private ArgumentCaptor<TeamHunt> teamHuntCaptor;

  @Captor
  private ArgumentCaptor<Map<String, String>> mapCaptor;

  @BeforeAll
  static void setupAll() {
    String mongoAddr = System.getenv().getOrDefault("MONGO_ADDR", "localhost");

    mongoClient = MongoClients.create(
        MongoClientSettings.builder()
            .applyToClusterSettings(builder -> builder.hosts(Arrays.asList(new ServerAddress(mongoAddr))))
            .build());
    db = mongoClient.getDatabase("test");
  }

  @AfterAll
  static void teardown() {
    db.drop();
    mongoClient.close();
  }

  @BeforeEach
  void setupEach() throws IOException {
    MockitoAnnotations.openMocks(this);

    MongoCollection<Document> hostDocuments = db.getCollection("hosts");
    hostDocuments.drop();
    frysId = new ObjectId();
    Document fry = new Document()
        .append("_id", frysId)
        .append("name", "Fry")
        .append("userName", "fry")
        .append("email", "fry@email");

    hostDocuments.insertOne(fry);

    MongoCollection<Document> huntDocuments = db.getCollection("hunts");
    huntDocuments.drop();
    List<Document> testHunts = new ArrayList<>();
    testHunts.add(
        new Document()
            .append("hostId", "frysId")
            .append("name", "Fry's Hunt")
            .append("description", "Fry's hunt for the seven leaf clover")
            .append("est", 20)
            .append("numberOfTasks", 5));
    testHunts.add(
        new Document()
            .append("hostId", "frysId")
            .append("name", "Fry's Hunt 2")
            .append("description", "Fry's hunt for Morris")
            .append("est", 30)
            .append("numberOfTasks", 2));
    testHunts.add(
        new Document()
            .append("hostId", "frysId")
            .append("name", "Fry's Hunt 3")
            .append("description", "Fry's hunt for money")
            .append("est", 40)
            .append("numberOfTasks", 1));

    huntId = new ObjectId();
    Document hunt = new Document()
        .append("_id", huntId)
        .append("hostId", "frysId")
        .append("name", "Best Hunt")
        .append("description", "This is the best hunt")
        .append("est", 20)
        .append("numberOfTasks", 3);

    huntDocuments.insertMany(testHunts);
    huntDocuments.insertOne(hunt);

    MongoCollection<Document> taskDocuments = db.getCollection("tasks");
    taskDocuments.drop();
    List<Document> testTasks = new ArrayList<>();
    testTasks.add(
        new Document()
            .append("huntId", huntId.toHexString())
            .append("name", "Take a picture of a cat")
            .append("status", false)
            .append("photo", ""));
    testTasks.add(
        new Document()
            .append("huntId", huntId.toHexString())
            .append("name", "Take a picture of a dog")
            .append("status", false)
            .append("photo", ""));
    testTasks.add(
        new Document()
            .append("huntId", huntId.toHexString())
            .append("name", "Take a picture of a park")
            .append("status", true)
            .append("photo", ""));

    taskId = new ObjectId();
    Document task = new Document()
        .append("_id", taskId)
        .append("huntId", "someId")
        .append("name", "Best Task")
        .append("status", false)
        .append("photo", "");

    taskDocuments.insertMany(testTasks);
    taskDocuments.insertOne(task);

    MongoCollection<Document> startedHuntsDocuments = db.getCollection("startedHunts");
    startedHuntsDocuments.drop();
    List<Document> startedHunts = new ArrayList<>();
    startedHunts.add(
        new Document()
            .append("accessCode", "123456")
            .append("completeHunt", new Document()
                .append("hunt", testHunts.get(0))
                .append("tasks", testTasks.subList(0, 2)))
            .append("status", true)
            .append("endDate", null));

    startedHunts.add(
        new Document()
            .append("accessCode", "654321")
            .append("completeHunt", new Document()
                .append("hunt", testHunts.get(1))
                .append("tasks", testTasks.subList(2, 3)))
            .append("status", false)
            .append("endDate", null));

    startedHuntId = new ObjectId();
    Document startedHunt = new Document()
        .append("_id", startedHuntId)
        .append("accessCode", "123456")
        .append("completeHunt", new Document()
            .append("hunt", testHunts.get(2))
            .append("tasks", testTasks.subList(0, 3)))
        .append("status", true)
        .append("endDate", null)
        .append("teamsLeft", 2);

    startedHuntsDocuments.insertMany(startedHunts);
    startedHuntsDocuments.insertOne(startedHunt);

    MongoCollection<Document> teamHuntsDocuments = db.getCollection("teamHunts");
    teamHuntsDocuments.drop();
    List<Document> teamHunts = new ArrayList<>();
    teamHunts.add(
        new Document()
            .append("startedHuntId", startedHuntId.toHexString())
            .append("teamName", "Team 1")
            .append("members", Arrays.asList("fry", "bender", "leela"))
            .append("tasks", testTasks.subList(0, 2)));

    teamHunts.add(
        new Document()
            .append("startedHuntId", startedHuntId.toHexString())
            .append("teamName", "Team 2")
            .append("members", Arrays.asList("fry", "bender", "leela"))
            .append("tasks", testTasks.subList(2, 3)));

    teamHuntId = new ObjectId();
    Document teamHunt = new Document()
        .append("_id", teamHuntId)
        .append("startedHuntId", startedHuntId.toHexString())
        .append("teamName", "Team 1")
        .append("members", Arrays.asList("fry", "bender", "leela"))
        .append("tasks", testTasks.subList(0, 3));

    teamHuntsDocuments.insertMany(teamHunts);
    teamHuntsDocuments.insertOne(teamHunt);

    startedHuntController = new StartedHuntController(db);
  }

  @Test
  void addRoutes() {
    Javalin mockServer = mock(Javalin.class);
    startedHuntController.addRoutes(mockServer);
    verify(mockServer, Mockito.atLeast(1)).get(any(), any());
  }

  @Test
  void getStartedHunt() throws IOException {
    when(ctx.pathParam("accessCode")).thenReturn("123456");

    startedHuntController.getStartedHunt(ctx);

    verify(ctx).json(startedHuntCaptor.capture());
    verify(ctx).status(HttpStatus.OK);

    assertEquals("123456", startedHuntCaptor.getValue().accessCode);
    assertEquals(true, startedHuntCaptor.getValue().status);
  }

  @Test
  void getStartedHuntWithNonExistentAccessCode() throws IOException {
    when(ctx.pathParam("accessCode")).thenReturn("588935");

    Throwable exception = assertThrows(NotFoundResponse.class, () -> {
      startedHuntController.getStartedHunt(ctx);
    });

    assertEquals("The requested access code was not found.", exception.getMessage());
  }

  @Test
  void getStartedHuntWithInvalidAccessCode() throws IOException {
    when(ctx.pathParam("accessCode")).thenReturn("12345"); // 5-digit number

    Throwable exception = assertThrows(BadRequestResponse.class, () -> {
      startedHuntController.getStartedHunt(ctx);
    });

    assertEquals("The requested access code is not a valid access code.", exception.getMessage());
  }

  @Test
  void getStartedHuntWithNonNumericAccessCode() throws IOException {
    when(ctx.pathParam("accessCode")).thenReturn("123abc"); // Access code with non-numeric characters

    Throwable exception = assertThrows(BadRequestResponse.class, () -> {
      startedHuntController.getStartedHunt(ctx);
    });

    assertEquals("The requested access code is not a valid access code.", exception.getMessage());
  }

  @Test
  void getStartedHuntWithStatusFalse() throws IOException {
    when(ctx.pathParam("accessCode")).thenReturn("654321");

    Throwable exception = assertThrows(BadRequestResponse.class, () -> {
      startedHuntController.getStartedHunt(ctx);
    });

    assertEquals("The requested hunt is no longer joinable.", exception.getMessage());
  }

  @Test
  void getEndedHunts() throws IOException {
    startedHuntController.getEndedHunts(ctx);

    verify(ctx).json(startedHuntArrayListCaptor.capture());

    assertEquals(1, startedHuntArrayListCaptor.getValue().size());
    for (StartedHunt startedHunt : startedHuntArrayListCaptor.getValue()) {
      assertEquals(false, startedHunt.status);
    }
  }

  @Test
  void endStartedHunt() throws IOException {
    when(ctx.pathParam("id")).thenReturn(startedHuntId.toHexString());
    when(ctx.pathParam("accessCode")).thenReturn("123456");

    // Check the initial status
    startedHuntController.getStartedHunt(ctx);
    verify(ctx).json(startedHuntCaptor.capture());
    assertEquals(true, startedHuntCaptor.getValue().status);
    assertNull(startedHuntCaptor.getValue().endDate); // Check that the endDate is null

    // End the hunt
    startedHuntController.endStartedHunt(ctx);
    verify(ctx, times(2)).status(HttpStatus.OK);

    // Check the status and endDate after ending the hunt
    startedHuntController.getEndedHunts(ctx);
    verify(ctx).json(startedHuntArrayListCaptor.capture());
    for (StartedHunt startedHunt : startedHuntArrayListCaptor.getValue()) {
      if (startedHunt._id.equals("123456")) {
        assertEquals(false, startedHunt.status);
      }
    }
  }

  @Test
  void endStartedHuntIsNull() throws IOException {
    when(ctx.pathParam("id")).thenReturn("588935f57546a2daea54de8c");

    assertThrows(NotFoundResponse.class, () -> {
      startedHuntController.endStartedHunt(ctx);
    });
  }

  @SuppressWarnings("unchecked")
  @Test
  void deleteFoundStartedHunt() throws IOException {
    UploadedFile uploadedFile = mock(UploadedFile.class);
    InputStream inputStream = new ByteArrayInputStream(new byte[0]);

    Document teamHuntDocument = db.getCollection("teamHunts")
        .find(eq("_id", new ObjectId(teamHuntId.toHexString()))).first();
    Document taskDocument = db.getCollection("tasks").find(eq("_id", new ObjectId(taskId.toHexString()))).first();
    teamHuntDocument.get("tasks", List.class).add(taskDocument);
    db.getCollection("teamHunts").replaceOne(eq("_id", new ObjectId(teamHuntId.toHexString())),
        teamHuntDocument);

    when(ctx.uploadedFile("photo")).thenReturn(uploadedFile);
    when(uploadedFile.content()).thenReturn(inputStream);
    when(uploadedFile.filename()).thenReturn("test.jpg");
    when(ctx.status(anyInt())).thenReturn(ctx);
    when(ctx.pathParam("taskId")).thenReturn(taskId.toHexString());
    when(ctx.pathParam("teamHuntId")).thenReturn(teamHuntId.toHexString());

    startedHuntController.addPhoto(ctx);

    String testID = startedHuntId.toHexString();
    when(ctx.pathParam("accessCode")).thenReturn("123456");

    assertEquals(1, db.getCollection("startedHunts").countDocuments(eq("_id", new ObjectId(testID))));

    when(ctx.pathParam("id")).thenReturn(testID);

    StartedHuntController spyStartedHuntController = Mockito.spy(startedHuntController);

    spyStartedHuntController.deleteStartedHunt(ctx);

    assertEquals(0, db.getCollection("startedHunts").countDocuments(eq("_id", new ObjectId(testID))));

  }

  @Test
  void tryToDeleteNotFoundStartedHunt() throws IOException {
    String testID = startedHuntId.toHexString();
    when(ctx.pathParam("id")).thenReturn(testID);

    startedHuntController.deleteStartedHunt(ctx);
    assertEquals(0, db.getCollection("hunts").countDocuments(eq("_id", new ObjectId(testID))));

    assertThrows(NotFoundResponse.class, () -> {
      startedHuntController.deleteStartedHunt(ctx);
    });

    verify(ctx).status(HttpStatus.NOT_FOUND);
    assertEquals(0, db.getCollection("hunts").countDocuments(eq("_id", new ObjectId(testID))));
  }

  @Test
  void testGetFileExtensionWithExtension() {
    String filename = "test.txt";

    String extension = startedHuntController.getFileExtension(filename);

    assertEquals("txt", extension);
  }

  @Test
  void testGetFileExtensionWithoutExtension() {
    String filename = "test";

    String extension = startedHuntController.getFileExtension(filename);

    assertEquals("", extension);
  }

  @Test
  void testUploadPhotoWithPhoto() throws IOException {
    UploadedFile uploadedFile = mock(UploadedFile.class);
    InputStream inputStream = new ByteArrayInputStream(new byte[0]);

    when(ctx.uploadedFile("photo")).thenReturn(uploadedFile);
    when(uploadedFile.content()).thenReturn(inputStream);
    when(uploadedFile.filename()).thenReturn("test.jpg");
    when(ctx.status(anyInt())).thenReturn(ctx);

    String id = startedHuntController.uploadPhoto(ctx);

    verify(ctx).status(HttpStatus.OK);
    startedHuntController.deletePhoto(id, ctx);
  }

  @Test
  void testUploadPhotoWithoutPhoto() {

    when(ctx.uploadedFile("photo")).thenReturn(null);
    when(ctx.status(anyInt())).thenReturn(ctx);

    try {
      startedHuntController.uploadPhoto(ctx);
      fail("Expected BadRequestResponse");
    } catch (BadRequestResponse e) {
      assertEquals("No photo uploaded", e.getMessage());
    }
  }

  @Test
  void testUploadPhotoWithException() throws IOException {

    UploadedFile uploadedFile = mock(UploadedFile.class);

    when(ctx.uploadedFile("photo")).thenReturn(uploadedFile);
    when(uploadedFile.content()).thenThrow(new RuntimeException("Test Exception"));
    when(ctx.status(anyInt())).thenReturn(ctx);

    try {
      startedHuntController.uploadPhoto(ctx);
      fail("Expected BadRequestResponse");
    } catch (BadRequestResponse e) {
      assertEquals("Error handling the uploaded file: Test Exception", e.getMessage());
    }
  }

  @Test
  void testDeletePhotoWithoutPhoto() {

    when(ctx.uploadedFile("photo")).thenReturn(null);
    when(ctx.status(anyInt())).thenReturn(ctx);

    try {
      startedHuntController.deletePhoto("test", ctx);
      fail("Expected BadRequestResponse");
    } catch (BadRequestResponse e) {
      assertEquals("Photo with ID test does not exist", e.getMessage());
    }
  }

  @Test
  void testDeletePhotoBadRequestResponse() {

    when(ctx.uploadedFile("photo")).thenReturn(null);
    when(ctx.status(anyInt())).thenReturn(ctx);

    try {
      startedHuntController.deletePhoto("test", ctx);
      fail("Expected BadRequestResponse");
    } catch (BadRequestResponse e) {
      assertEquals("Photo with ID test does not exist", e.getMessage());
    }
  }

  @SuppressWarnings("unchecked")
  @Test
  void testAddPhotoPathToTask() throws IOException {
    String photoPath = "test.jpg";
    Document teamHunt = db.getCollection("teamHunts")
        .find(eq("_id", new ObjectId(teamHuntId.toHexString()))).first();
    Document task = db.getCollection("tasks").find(eq("_id", new ObjectId(taskId.toHexString()))).first();
    teamHunt.get("tasks", List.class).add(task);
    db.getCollection("teamHunts").replaceOne(eq("_id", new ObjectId(teamHuntId.toHexString())), teamHunt);

    when(ctx.pathParam("taskId")).thenReturn(taskId.toHexString());
    when(ctx.pathParam("teamHuntId")).thenReturn(teamHuntId.toHexString());

    startedHuntController.addPhotoPathToTask(ctx, photoPath);

    when(ctx.pathParam("taskId")).thenReturn(taskId.toHexString());
    when(ctx.pathParam("teamHuntId")).thenReturn(teamHuntId.toHexString());
    Document updatedTask = (Document) db.getCollection("teamHunts")
        .find(eq("_id", new ObjectId(teamHuntId.toHexString())))
        .first().get("tasks", List.class).get(3);
    assertNotNull(updatedTask);
    assertNotEquals(null, updatedTask.get("photo", String.class));
  }

  @Test
  void testAddPhotoPathToTaskBadTaskId() {
    String id = "588935f56536a3daea54de8c";
    String photoPath = "photoPath";

    when(ctx.pathParam("id")).thenReturn(id);
    when(ctx.pathParam("teamHuntId")).thenReturn(teamHuntId.toHexString());

    assertThrows(BadRequestResponse.class, () -> startedHuntController.addPhotoPathToTask(ctx, photoPath));
    verify(ctx).status(HttpStatus.NOT_FOUND);
  }

  @Test
  void testAddPhotoPathToTaskBadStartedHuntId() {
    String id = "588935f56536a3daea54de8c";
    String photoPath = "photoPath";

    when(ctx.pathParam("taskId")).thenReturn(taskId.toHexString());
    when(ctx.pathParam("teamHuntId")).thenReturn(id);

    assertThrows(BadRequestResponse.class, () -> startedHuntController.addPhotoPathToTask(ctx, photoPath));
    verify(ctx).status(HttpStatus.NOT_FOUND);
  }

  @SuppressWarnings("unchecked")
  @Test
  void testAddPhoto() {
    UploadedFile uploadedFile = mock(UploadedFile.class);
    InputStream inputStream = new ByteArrayInputStream(new byte[0]);

    Document teamHunt = db.getCollection("teamHunts")
        .find(eq("_id", new ObjectId(teamHuntId.toHexString()))).first();
    Document task = db.getCollection("tasks").find(eq("_id", new ObjectId(taskId.toHexString()))).first();
    teamHunt.get("tasks", List.class).add(task);
    db.getCollection("teamHunts").replaceOne(eq("_id", new ObjectId(teamHuntId.toHexString())), teamHunt);

    when(ctx.uploadedFile("photo")).thenReturn(uploadedFile);
    when(uploadedFile.content()).thenReturn(inputStream);
    when(uploadedFile.filename()).thenReturn("test.jpg");
    when(ctx.status(anyInt())).thenReturn(ctx);
    when(ctx.pathParam("taskId")).thenReturn(taskId.toHexString());
    when(ctx.pathParam("teamHuntId")).thenReturn(teamHuntId.toHexString());

    startedHuntController.addPhoto(ctx);

    Document updatedTask = (Document) db.getCollection("teamHunts")
        .find(eq("_id", new ObjectId(teamHuntId.toHexString())))
        .first().get("tasks", List.class).get(3);
    String id = updatedTask.get("photo", String.class);

    verify(ctx).status(HttpStatus.OK);
    startedHuntController.deletePhoto(id, ctx);
  }

  @SuppressWarnings("unchecked")
  @Test
  void testGetPhotoFromTask() throws IOException {
    // Create a Task with the paths of the temporary files
    UploadedFile uploadedFile = mock(UploadedFile.class);
    InputStream inputStream = new ByteArrayInputStream(new byte[0]);

    Document teamHunt = db.getCollection("teamHunts").find(eq("_id", new ObjectId(teamHuntId.toHexString())))
        .first();
    Document testTask = db.getCollection("tasks").find(eq("_id", new ObjectId(taskId.toHexString()))).first();
    teamHunt.get("tasks", List.class).add(testTask);
    db.getCollection("teamHunts").replaceOne(eq("_id", new ObjectId(teamHuntId.toHexString())), teamHunt);

    when(ctx.uploadedFile("photo")).thenReturn(uploadedFile);
    when(uploadedFile.content()).thenReturn(inputStream);
    when(uploadedFile.filename()).thenReturn("test.jpg");
    when(ctx.status(anyInt())).thenReturn(ctx);
    when(ctx.pathParam("taskId")).thenReturn(taskId.toHexString());
    when(ctx.pathParam("teamHuntId")).thenReturn(teamHuntId.toHexString());

    startedHuntController.addPhoto(ctx);

    Document updatedTask = (Document) db.getCollection("teamHunts")
        .find(eq("_id", new ObjectId(teamHuntId.toHexString())))
        .first().get("tasks", List.class).get(3);
    Task task = new Task();
    task.photo = updatedTask.get("photo", String.class);
    task.huntId = updatedTask.getString("huntId");
    task.name = updatedTask.getString("name");
    task.status = updatedTask.getBoolean("status");
    task._id = updatedTask.getObjectId("_id").toHexString();

    File addedFile = new File("photos/" + task.photo);

    // Call the method under test
    String encodedPhoto = startedHuntController.getPhotoFromTask(task);

    assertNotEquals(null, encodedPhoto);

    // Check that the returned list contains the correct encoded photos
    byte[] bytes1 = Files.readAllBytes(addedFile.toPath());
    String expectedEncoded1 = "data:image/png;base64," + Base64.getEncoder().encodeToString(bytes1);
    assertEquals(expectedEncoded1, encodedPhoto);

    startedHuntController.deletePhoto(task.photo, ctx);
  }

  @Test
  void testGetStartedHuntByIdValidId() {
    when(ctx.pathParam("id")).thenReturn(startedHuntId.toHexString());

    StartedHunt startedHunt = startedHuntController.getStartedHuntById(ctx);

    assertEquals("123456", startedHunt.accessCode);
    assertEquals(true, startedHunt.status);
  }

  @Test
  void testGetStartedHuntByIdInvalidId() {
    String id = "invalid_id";

    when(ctx.pathParam("id")).thenReturn(id);

    assertThrows(BadRequestResponse.class, () -> startedHuntController.getStartedHuntById(ctx));
  }

  @Test
  void testGetStartedHuntByIdNotFound() {
    String id = new ObjectId().toHexString();

    when(ctx.pathParam("id")).thenReturn(id);

    assertThrows(NotFoundResponse.class, () -> startedHuntController.getStartedHuntById(ctx));
  }

  @Test
  void testGetFinishedTasks() {
    ArrayList<Document> taskDocuments = db.getCollection("tasks").find(eq("huntId", huntId.toHexString()))
        .into(new ArrayList<>());
    ArrayList<Task> tasks = new ArrayList<>();

    for (Document taskDocument : taskDocuments) {
      Task task = new Task();
      task._id = taskDocument.getObjectId("_id").toHexString();
      task.huntId = taskDocument.getString("huntId");
      task.name = taskDocument.getString("name");
      task.status = taskDocument.getBoolean("status");
      task.photo = taskDocument.get("photo", String.class);
      tasks.add(task);
    }

    List<FinishedTask> finishedTasks = startedHuntController.getFinishedTasks(tasks);

    assertEquals(3, finishedTasks.size());
  }

  @Test
  void testGetEndedHunt() {
    ArrayList<Document> taskDocuments = db.getCollection("tasks").find(eq("huntId", huntId.toHexString()))
        .into(new ArrayList<>());

    when(ctx.pathParam("id")).thenReturn(startedHuntId.toHexString());

    startedHuntController.getEndedHunt(ctx);

    verify(ctx).status(HttpStatus.OK);
    verify(ctx).json(finishedHuntCaptor.capture());

    EndedHunt finishedHunt = finishedHuntCaptor.getValue();
    assertNotNull(finishedHunt.teamHunts);
    assertEquals(taskDocuments.get(0).get("_id").toString(), finishedHunt.finishedTasks.get(0).taskId);
    assertEquals(taskDocuments.get(1).get("_id").toString(), finishedHunt.finishedTasks.get(1).taskId);
    assertEquals(taskDocuments.get(2).get("_id").toString(), finishedHunt.finishedTasks.get(2).taskId);
  }

  @SuppressWarnings("unchecked")
  @Test
  void addTeamHunt() throws IOException {
    String startedHuntIdHex = startedHuntId.toHexString();
    String testNewStartedHunt = """
        {
          "startedHuntId": "%s",
          "teamName": "New Hunt",
          "members": ["fry", "bender", "leela"],
          "tasks": []
        }
        """.formatted(startedHuntIdHex);

    when(ctx.bodyValidator(TeamHunt.class))
        .then(value -> new BodyValidator<TeamHunt>(testNewStartedHunt, TeamHunt.class, javalinJackson));

    startedHuntController.makeTeamHunt(ctx);
    verify(ctx).json(mapCaptor.capture());

    verify(ctx).status(HttpStatus.CREATED);

    Document addedTeamHunt = db.getCollection("teamHunts")
        .find(eq("_id", new ObjectId(mapCaptor.getValue().get("id")))).first();

    assertNotEquals("", addedTeamHunt.get("_id"));
    assertEquals("New Hunt", addedTeamHunt.get("teamName"));
    assertEquals(startedHuntIdHex, addedTeamHunt.get("startedHuntId"));
    assertEquals(3, ((List<String>) addedTeamHunt.get("members")).size());
    assertEquals(3, ((List<Document>) addedTeamHunt.get("tasks")).size());

    Document updatedStartedHunt = db.getCollection("startedHunts")
        .find(eq("_id", new ObjectId(startedHuntIdHex))).first();

    assertEquals(1, updatedStartedHunt.get("teamsLeft"));
  }

  @Test
  void addTeamHuntWithInvalidStartedHuntId() {
    String testNewStartedHunt = """
        {
          "startedHuntId": "588935f57546a2daea54de8c",
          "teamName": "New Hunt",
          "members": ["fry", "bender", "leela"],
          "tasks": []
        }
        """;

    when(ctx.bodyValidator(TeamHunt.class))
        .then(value -> new BodyValidator<TeamHunt>(testNewStartedHunt, TeamHunt.class, javalinJackson));

    assertThrows(BadRequestResponse.class, () -> {
      startedHuntController.makeTeamHunt(ctx);
    });
  }

  @Test
  void addTeamHuntWithInvalidNullStartedHuntId() {
    String testNewStartedHunt = """
        {
          "startedHuntId": null,
          "teamName": "New Hunt",
          "members": ["fry", "bender", "leela", "Nick", "Daisy", "fry", "bender", "leela", "Nick", "Daisy",
          "fry", "bender", "leela", "Nick", "Daisy", "fry", "bender", "leela", "Nick", "Daisy", "fry", "bender"],
          "tasks": []
        }
        """;

    when(ctx.bodyValidator(TeamHunt.class))
        .then(value -> new BodyValidator<TeamHunt>(testNewStartedHunt, TeamHunt.class, javalinJackson));

    assertThrows(ValidationException.class, () -> {
      startedHuntController.makeTeamHunt(ctx);
    });
  }

  @Test
  void addTeamHuntWithInvalidLengthStartedHuntId() {
    String testNewStartedHunt = """
        {
          "startedHuntId": "",
          "teamName": "New Hunt",
          "members": ["fry", "bender", "leela", "Nick", "Daisy", "fry", "bender", "leela", "Nick", "Daisy",
          "fry", "bender", "leela", "Nick", "Daisy", "fry", "bender", "leela", "Nick", "Daisy", "fry", "bender"],
          "tasks": []
        }
        """;

    when(ctx.bodyValidator(TeamHunt.class))
        .then(value -> new BodyValidator<TeamHunt>(testNewStartedHunt, TeamHunt.class, javalinJackson));

    assertThrows(ValidationException.class, () -> {
      startedHuntController.makeTeamHunt(ctx);
    });
  }

  @Test
  void addTeamHuntWithInvalidTeamName() {
    String startedHuntIdHex = startedHuntId.toHexString();
    String testNewStartedHunt = """
        {
          "startedHuntId": "%s",
          "teamName": "",
          "members": ["fry", "bender", "leela"],
          "tasks": []
        }
        """.formatted(startedHuntIdHex);

    when(ctx.bodyValidator(TeamHunt.class))
        .then(value -> new BodyValidator<TeamHunt>(testNewStartedHunt, TeamHunt.class, javalinJackson));

    assertThrows(ValidationException.class, () -> {
      startedHuntController.makeTeamHunt(ctx);
    });
  }

  @Test
  void addTeamHuntWithInvalidLongTeamName() {
    String startedHuntIdHex = startedHuntId.toHexString();
    String testNewStartedHunt = """
        {
          "startedHuntId": "%s",
          "teamName": "This is a very long team name that is longer than 50 characters",
          "members": ["fry", "bender", "leela"],
          "tasks": []
        }
        """.formatted(startedHuntIdHex);

    when(ctx.bodyValidator(TeamHunt.class))
        .then(value -> new BodyValidator<TeamHunt>(testNewStartedHunt, TeamHunt.class, javalinJackson));

    assertThrows(ValidationException.class, () -> {
      startedHuntController.makeTeamHunt(ctx);
    });
  }

  @Test
  void addTeamHuntWithInvalidMembers() {
    String startedHuntIdHex = startedHuntId.toHexString();
    String testNewStartedHunt = """
        {
          "startedHuntId": "%s",
          "teamName": "New Hunt",
          "members": [],
          "tasks": []
        }
        """.formatted(startedHuntIdHex);

    when(ctx.bodyValidator(TeamHunt.class))
        .then(value -> new BodyValidator<TeamHunt>(testNewStartedHunt, TeamHunt.class, javalinJackson));

    assertThrows(ValidationException.class, () -> {
      startedHuntController.makeTeamHunt(ctx);
    });
  }

  @Test
  void addTeamHuntWithInvalidToManyMembers() {
    String startedHuntIdHex = startedHuntId.toHexString();
    String testNewStartedHunt = """
        {
          "startedHuntId": "%s",
          "teamName": "New Hunt",
          "members": ["fry", "bender", "leela", "Nick", "Daisy", "fry", "bender", "leela", "Nick", "Daisy",
          "fry", "bender", "leela", "Nick", "Daisy", "fry", "bender", "leela", "Nick", "Daisy", "fry", "bender"],
          "tasks": []
        }
        """.formatted(startedHuntIdHex);

    when(ctx.bodyValidator(TeamHunt.class))
        .then(value -> new BodyValidator<TeamHunt>(testNewStartedHunt, TeamHunt.class, javalinJackson));

    assertThrows(ValidationException.class, () -> {
      startedHuntController.makeTeamHunt(ctx);
    });
  }

  @Test
  void testMakeTeamHuntHuntEnded() {
    String startedHuntIdHex = startedHuntId.toHexString();
    ObjectId id = new ObjectId(startedHuntIdHex);
    db.getCollection("startedHunts").updateOne(eq("_id", id), set("status", false));
    String testNewStartedHunt = """
        {
          "startedHuntId": "%s",
          "teamName": "New Hunt",
          "members": ["fry", "bender", "leela"],
          "tasks": []
        }
        """.formatted(startedHuntIdHex);

    when(ctx.bodyValidator(TeamHunt.class))
        .then(value -> new BodyValidator<TeamHunt>(testNewStartedHunt, TeamHunt.class, javalinJackson));

    assertThrows(BadRequestResponse.class, () -> {
      startedHuntController.makeTeamHunt(ctx);
    });

    verify(ctx).status(HttpStatus.BAD_REQUEST);
  }

  @Test
  void testMakeTeamHuntHuntFull() {
    String startedHuntIdHex = startedHuntId.toHexString();
    ObjectId id = new ObjectId(startedHuntIdHex);
    db.getCollection("startedHunts").updateOne(eq("_id", id), set("teamsLeft", 0));
    String testNewStartedHunt = """
        {
          "startedHuntId": "%s",
          "teamName": "New Hunt",
          "members": ["fry", "bender", "leela"],
          "tasks": []
        }
        """.formatted(startedHuntIdHex);

    when(ctx.bodyValidator(TeamHunt.class))
        .then(value -> new BodyValidator<TeamHunt>(testNewStartedHunt, TeamHunt.class, javalinJackson));

    assertThrows(BadRequestResponse.class, () -> {
      startedHuntController.makeTeamHunt(ctx);
    });

    verify(ctx).status(HttpStatus.BAD_REQUEST);
  }

  @Test
  void getTeamHuntById() throws IOException {
    String id = teamHuntId.toHexString();
    when(ctx.pathParam("id")).thenReturn(id);

    startedHuntController.getTeamHunt(ctx);

    verify(ctx).json(teamHuntCaptor.capture());
    verify(ctx).status(HttpStatus.OK);
  }

  @Test
  void getTeamHuntWithBadId() throws IOException {
    when(ctx.pathParam("id")).thenReturn("bad");

    Throwable exception = assertThrows(BadRequestResponse.class, () -> {
      startedHuntController.getTeamHunt(ctx);
    });

    ctx.status(HttpStatus.BAD_REQUEST);
    assertEquals("The requested team id 'bad' wasn't a legal Mongo Object ID.", exception.getMessage());
  }

  @Test
  void getTeamHuntWithNonexistentId() throws IOException {
    String id = "588935f5c668650dc77df581";
    when(ctx.pathParam("id")).thenReturn(id);

    Throwable exception = assertThrows(NotFoundResponse.class, () -> {
      startedHuntController.getTeamHunt(ctx);
    });

    ctx.status(HttpStatus.NOT_FOUND);
    assertEquals("The requested team hunt with id '588935f5c668650dc77df581' was not found", exception.getMessage());
  }

  @Test
  void deleteFoundTeamHunt() throws IOException {
    String id = teamHuntId.toHexString();

    startedHuntController.deleteTeamHunt(id);

    assertEquals(0, db.getCollection("teamHunts").countDocuments(eq("_id", new ObjectId(id))));
  }

  @Test
  public void testDeleteTeamHuntNotFound() {
    String id = "6629834cfe108543ff502ca3";

    Throwable exception = assertThrows(NotFoundResponse.class, () -> {
      startedHuntController.deleteTeamHunt(id);
    });

    assertTrue(exception.getMessage().contains("Was unable to delete team hunt with ID 6629834cfe108543ff502ca3"));
  }

  @Test
  public void testCreateDirectoryIfNotExists() throws IOException {

    File directory = new File("photos");

    // Delete the directory even if it's not empty
    Files.walk(directory.toPath())
      .sorted(Comparator.reverseOrder())
      .map(Path::toFile)
      .forEach(File::delete);

    Path directoryPath = Paths.get("photos");

    assertFalse(Files.exists(directoryPath));

    startedHuntController = new StartedHuntController(db);

    assertTrue(Files.exists(directoryPath));

    // Delete the directory even if it's not empty
    Files.walk(directory.toPath())
      .sorted(Comparator.reverseOrder())
      .map(Path::toFile)
      .forEach(File::delete);
  }
}
