# finalchat
#firebase rules
{
	"rules":{"users":
  	{"$userid":
    	{".read":"$userid === auth.uid",".write":"$userid === auth.uid"}
    		},
  
	"groups":
  	{"rules":{".write":"!newData.exists()",
      ".read":true},
        "$gname":
        {"metadata":{"admin":{".write":"data.val()===auth.uid || !data.exists()"},"members":{".write":"data.parent().child('admin').val()===auth.uid || !data.parent().child('admin').exists()"}},
          "messages":{
        ".read":true,
        ".write":"data.parent().child('metadata').child('members').child(auth.uid).exists()"  
      }}},
  	"online":{".read":true,
        ".write":true}
    }
   
}
