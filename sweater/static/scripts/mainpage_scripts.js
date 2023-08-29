let page = 1;


 const news_per_page_num = 8;
        const all_news = parseInt('{{ max_news }}');

        function getNewNews(){
            $.ajax({
                type: 'GET',
                url: `{{ url_for('send_news_req') }}`,
                data: {'page': page},
                cache: false,
                success: function(response){
                    $('#news__container').append(response);
                    if(page * news_per_page_num >= all_news)  // Проверка наличия еще страниц пагинации
                        $("#more")[0].style.display = 'none';
                    page++
                }
            })
        }