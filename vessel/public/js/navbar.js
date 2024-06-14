$(document).ready(function(){
     // Clear existing breadcrumbs
     $('.breadcrumbs').empty();
        
     // Get the path of the current page
     var path = window.location.pathname.split('/').filter(function(item) {
         return item !== '';
     });

     // Add Home breadcrumb
     $('.breadcrumbs').append('<a href="/admin">Admin</a>');

     // Generate breadcrumbs for each segment of the path
     var fullPath = '';
     for (var i = 0; i < path.length; i++) {
         fullPath += '/' + path[i];
         $('.breadcrumbs').append('<span> > </span><a href="' + fullPath + '">' + path[i].replaceAll("%20"," ") + '</a>');
     }
})