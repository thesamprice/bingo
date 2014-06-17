
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
   alert(card_name)
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
    var numbers = []
    for(row=0;row<5;row++)
    {
        
        var used_numbers = [] 
        for(col=0;col<5;col++)
        {
            var selector = 'tr.row-' + row 
            selector = selector + ' td.col-' + col
            selector = selector + ' select'
            number = $(selector).val()
            used_numbers.push(number)
        }
        numbers.push(used_numbers);
    }
    card_name = $('#cardname').val();
    alert(numbers)
    database['cards'][cardname] = numbers;
}
$('#EnterCallback').click(function ()
{
   if(ValidateCardName() == false)
       return;
   if(ValidateNumbers() == false)
       return;
   /*Paul save them numbers */
   BuildCard()
   alert('Saved card');
});
