package umm3601.hunt;

import org.mongojack.Id;
import org.mongojack.ObjectId;

@SuppressWarnings({"VisibilityModifier"})
public class Hunt {

    @ObjectId @Id
    @SuppressWarnings({"MemberName"})
    public String _id;

    public String hostId;

    public String name;
    public String description;
    public int est;
    public int numberOfTasks;
}
