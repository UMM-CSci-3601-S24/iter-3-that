package umm3601.startedHunt;

import java.util.Date;

import org.mongojack.Id;
import org.mongojack.ObjectId;

import umm3601.hunt.CompleteHunt;

@SuppressWarnings({ "VisibilityModifier" })
public class StartedHunt {

  @ObjectId
  @Id
  @SuppressWarnings({ "MemberName" })
  public String _id;
  public String accessCode;
  public CompleteHunt completeHunt;
  public Boolean status;
  public Date endDate;
  public int teamsLeft;
}
