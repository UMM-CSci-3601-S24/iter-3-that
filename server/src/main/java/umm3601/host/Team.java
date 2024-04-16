package umm3601.host;

import java.util.List;

import org.mongojack.Id;
import org.mongojack.ObjectId;

@SuppressWarnings({"VisibilityModifier"})
public class Team {

    @ObjectId @Id
    @SuppressWarnings({"MemberName"})
    public String _id;

    public String teamName;
    public List<String> members;
}
