var database=$.cookie('db');
//var database=undefined;
/*Paul or someone upgrade this to mongo?*/
function DatabaseBuild()
{
    var numbers_count = {};
    for(var x=1;x<= 65;x++)
    {
        numbers_count[x] = 0;
    }
    database={'ver':1,'cards':{}, 'numbers_used':numbers_count};
   return database;
}
function DatabaseSave()
{
    var dat = JSON.stringify(database)
    $.cookie('db',dat,{'path':'/'});
}
if( database == undefined)
{
   database = DatabaseBuild()
   DatabaseSave();
}
else
{
    database = JSON.parse(database);
}
