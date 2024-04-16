package umm3601.startedHunt;

import java.util.List;

import org.mongojack.Id;
import org.mongojack.ObjectId;

@SuppressWarnings({"VisibilityModifier"})
public class TeamHunt {

    @ObjectId @Id
    @SuppressWarnings({"MemberName"})
    public String _id;

    public String teamName;
    public List<String> members;
    public StartedHunt startedHunt;
}
