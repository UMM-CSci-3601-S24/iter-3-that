# To-Do List <!-- omit in toc -->

## Known Issues:
* When a hunter types an invite code into the “Type Invite Code” box and deletes the code, the application still allows the hunter to join the hunt associated with the invite code they deleted.
* The front-end appearance for hunters isn’t as polished as we wanted it to be. Specifically on the page hunters use to submit photos, the font style and text colors are different from other pages.
* Once a hunter has joined a hunt using the invite code, they are directed to the “Create Team” page. This page has a “Team Member” field where hunters can type the names of their team members. Next to this field should be a “Remove Member” and “Add Member” button, but these buttons sometimes disappear. The buttons also change positions when the page is refreshed.
* There are also errors with dark mode and its effects on stylization. Sometimes front-end modules will change to a black background while the rest of the module's formatting stays the same. 
* Editing a default hunt button didn’t work on Droplet one time. We haven’t figured out why the function failed. 
* Slow load time for images on the client side could be improved upon by using picture compression on the server side instead of resizing them on the client side.
