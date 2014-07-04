var gah = undefined;
$('#HeadNav li a').click(function( e )
{
     node = e.target;
     $('#PageEntry').hide()
     $('#PageSelect').hide()
     $('#PagePlay').hide()
     $('#PageStats').hide()

     var href = $(node).attr('href');
     $(href).show()
})


/* Startup Build board */
var table = $('#EntryTable');
var row_ranges = {0:[1,15],
    1:[16,30],
    2:[31,45],
    3:[46,60],
    4:[61,75]
}

function BuildCol(col)
{
    var build_ranges = document.createElement('select')
    $(build_ranges).attr({'class':'form-control num_input'})
    var ranges = row_ranges[col];
    for(x = ranges[0]; x<= ranges[1]; x++)
    {
        var opt = document.createElement('option');
        $(opt).attr({'value':x});
        $(opt).text(x);
        $(build_ranges).append(opt)
    }
    return build_ranges
}
for(row = 0; row< 5; row++)
{
    var rowEl = document.createElement('tr');
    $(rowEl).attr({'class':'row-' + row});

    $(table).append(rowEl);

    for(col = 0;col < 5; col++)
    {
       var colEl = document.createElement('td')
       $(colEl).attr({'class':'col-' + col})
       
       var inputEl = BuildCol(col) 
       $(inputEl).val(row_ranges[col][0]+row)
       $(inputEl).attr({'row':row,'col':col}) 
       $(colEl).append(inputEl)
       $(rowEl).append(colEl)
    }
}
$('.row-2 .col-2').text('FREE')

function ValidateCardName()
{
   var card_name = $('#cardname').val();
   if(card_name==''){
       alert('Card name cant be ""');
       return false;
   }
   return true; 
}
function ValidateNumbers()
{
   var used_numbers = [] 
    for(row=0;row<5;row++)
    {
        for(col=0;col<5;col++)
        {
            var selector = 'tr.row-' + row 
            selector = selector + ' td.col-' + col
            selector = selector + ' select'
            number = $(selector).val()
            if($.inArray(number,used_numbers) != -1)
            {
                alert(used_numbers)
                 alert(number + ' Used More than once'
                         )
                 return false;
            }
            used_numbers.push(number)
        }

    }
   return true;
}

function BuildCard()
{
    var col_num = Array(5) 
    for(col=0;col<5;col++)
    {
        var row_num = Array(5) 
        for(row=0;row<5;row++)
        {
        
           var selector = 'tr.row-' + row 
            selector = selector + ' td.col-' + col
            selector = selector + ' select'
            var number = parseInt($(selector).val())
            if(number == undefined)
                number = -1
            row_num[row] = number
        }
        col_num[col] = row_num;
    }
    card_name = $('#cardname').val();
    database['cards'][card_name] = col_num;
    DatabaseSave()
}
$('#EnterCallback').click(function ()
{
   if(ValidateCardName() == false)
       return;
   if(ValidateNumbers() == false)
       return;
   /*Paul save them numbers */
   BuildCard()
   SelectCardsPopulate();
   alert('Saved card');
});


function SelectCardsPopulate()
{
    /*TODO Save off currently selected cards ... */
    $('#PageSelect').empty()
    for (var key in database['cards']) {
        var sp = document.createElement('div');
        $(sp).text(key);

        var card_num = document.createElement('input');
        $(card_num).attr({'type':'checkbox','data-label':key,'class':'SelectCardCheck'})
        $(sp).append(card_num)
        $('#PageSelect').append(sp)
        $(card_num).text(key);
    }
}
SelectCardsPopulate();
var SelectedCards=[]
var SelectedCardNames = []
function SelectCurrentCards()
{
   SelectedCards=[]
   SelectedCardNames = []
   var elems = $('.SelectCardCheck:checked')
   var count = elems.length;
   elems.each(function(i,obj){
       key = $(obj).text()
       SelectedCardNames.push(key) 
       SelectedCards.push(database['cards'][key])
       if(i == count-1)
       {
           PlayModeBuild();
       }
   });
}

$('#PagePlayHit').click(function()
{
    SelectCurrentCards();
});
function PlayBuildCard(card_name,card)
{

      html_card = $('#PlayCardDefault').clone()
     $(html_card).attr({'id':card_name}).show()
     $('#PlayCards').append(html_card)
     $('#'+card_name + ' h4.PlayCardName').text(card_name)
     for(col=0;col<5;col++)
     {
         for(row=0;row<5;row++)
         {
             num = card[col][row]
             selector = '#' +card_name +' .card-col-'+col + '.card-row-' + row
             $(selector).addClass('card-num-'+num)
         }
     }
}
function PlayModeBuild()
{
    $('#PlayCards').empty()
   var Cols = Array(5)
   for(x =0;x<5;x++)
   {
       Cols[x] = Array()
   }
   for( x in SelectedCards)
   {
       card = SelectedCards[x];
       card_name = SelectedCardNames[x]
       PlayBuildCard(card_name,card)
       for(col = 0;col<5;col++)
       {
           for(row=0;row<5;row++)
           {
               num = card[col][row];
                if(isNaN(num))
                    continue
               if($.inArray(num,Cols[col]) == -1)
               {
                   Cols[col].push(num)
               }
           }
       }
   }
   for(col=0;col<5;col++)
   {
      Cols[col] = Cols[col].sort(function(a, b){return a-b})
      var name = '#Play-' + col
      $(name).empty()
      for(i in Cols[col])
      {
          var num = parseInt( Cols[col][i])
          if(isNaN(num))
              continue
          var sp = document.createElement('div');
          $(sp).text(num);
              
        var card_num = document.createElement('input');
        $(card_num).attr({'type':'checkbox','value':num,'class':'PlayCheck'})
        $(sp).append(card_num)

        $(name).append(sp) 
      }
   }
   $('.PlayCheck').change(PlayCheckCallback)

   $('.card-col-2.card-row-2').addClass('cardcellOn')
   CalledNumbers = Array()

}

var CalledNumbers = Array()
function PlayCheckCallback(obj)
{
 var obj =  $(obj.target) 
  var num = parseInt(obj.val())
 
  if(obj.prop('checked'))
  {

      if($.inArray(num,CalledNumbers) == -1)
      {

        CalledNumbers.push(num)
        $('.card-num-'+num).addClass('cardcellOn')
        CheckCards();
      }
  }
  else
  {
      var index = CalledNumbers.indexOf(num);
      if (index > -1) {
              CalledNumbers.splice(index, 1);
      }
      $('.card-num-'+num).removeClass('cardcellOn')
  }
}

function CheckCards()
{
  var Winner  = false;
   for( x in SelectedCards)
   {
       card = SelectedCards[x];
       card_name = SelectedCardNames[x]
     
       /* Check Cols */
       for(col = 0;col<5;col++)
       {
           Winner = true;
           query = '#' + card_name + ' .card-col-' + col
           for(row=0;row<5;row++)
           {
              query2 = query + '.card-row-' + row
              if(false == $(query2).hasClass('cardcellOn'))
              {
                Winner = false;
                break;
              }

           }
           if(Winner == true)
           {
              alert( card_name)
           }
       }

        /* Check Cols */
       for(row = 0;row<5;row++)
       {
           Winner = true;
           query = '#' + card_name + ' .card-col-' + col
           for(col=0;col<5;col++)
           {
              query2 = query + '.card-row-' + row
              if(false == $(query2).hasClass('cardcellOn'))
              {
                Winner = false;
                break;
              }

           }
           if(Winner == true)
           {
              alert( card_name)
              return;
           }
       }

        var diag = [[0,0],[1,1],[3,3],[4,4]];
        Winner = true;
        for( i = 0;i<4; i++)
        {
           col = diag[i][0]
           row = diag[i][1]
           query = '#' + card_name + ' .card-col-' + col
           query2 = query + '.card-row-' + row
           if(false == $(query2).hasClass('cardcellOn'))
           {
              Winner = false;
              break;
            }
        }
        if(Winner == true)
        {
          alert( card_name)
          return;
        }
    var diag = [[0,4],[1,3],[3,1],[4,0]];
        Winner = true;
        for( i = 0;i<4; i++)
        {
           col = diag[i][0]
           row = diag[i][1]
           query = '#' + card_name + ' .card-col-' + col
           query2 = query + '.card-row-' + row
           if(false == $(query2).hasClass('cardcellOn'))
           {
              Winner = false;
              break;
            }
        }
        if(Winner == true)
        {
          alert( card_name)
          return;
        }
   }
}



for(row=0;row<5;row++)
{
    var rel = document.createElement('tr')
    $('#PlayCardDefault .PlayCardTable').append(rel);
    for(col=0;col<5;col++)
    {
        var cel = document.createElement('td')
        $(rel).append(cel)
        var classname = 'cardcell card-col-'+col+' card-row-'+row
        $(cel).attr({'class':classname})
        
    }
}
$('#PlayCardDefault').hide()
