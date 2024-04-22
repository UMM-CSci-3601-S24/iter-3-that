package umm3601.startedHunt;

import java.util.List;

import org.mongojack.Id;
import org.mongojack.ObjectId;

import umm3601.hunt.Task;

@SuppressWarnings({"VisibilityModifier"})
public class TeamHunt {

    @ObjectId @Id
    @SuppressWarnings({"MemberName"})
    public String _id;

    public String startedHuntId;
    public String teamName;
    public List<String> members;
    public List<Task> tasks;
}
