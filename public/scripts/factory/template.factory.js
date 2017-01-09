app.factory("TemplateFactory", function($http) {
    console.log('TemplateFactory started');

    var categoryTemplate = [{
            id: 1,
            category_name: 'Flow',
            category_text: 'Lorem ipsum dolor sit amet, ad mel persius labores perfecto. Vis enim graeco ei. Ad mea ludus albucius oporteat, ex eros quaestio appellantur sit. Cu usu reque errem, est mundi integre imperdiet ne. Eu his labitur electram. Vel eu nibh patrioque scriptorem, choro percipit apeirian cum ne.'
        },
        {
            id: 2,
            category_name: 'Flex',
            category_text: 'Ei has fugit constituto, ei nec alia sonet nominavi. Usu modo dico dolorem ad. Unum dolor tation ut his, no vix delicata inciderint. At quo atqui convenire intellegebat.'
        },
        {
            id: 3,
            category_name: 'Financial',
            category_text: 'Copiosae nominati nec ne. Mea partem tincidunt at, appareat dignissim ex vix. Per ne vide iusto labore. Eam erat audire necessitatibus at. Gloriatur rationibus ius ut, ne viderer inermis intellegam mel. Nec te tale feugait civibus, ad partem reprimique honestatis cum.'
        },
        {
            id: 4,
            category_name: 'Functional',
            category_text: 'Dolor aliquip copiosae per id, his aeque ludus erroribus no. Ad his alia tacimates. Ipsum exerci posidonium duo cu. Ut nec clita insolens disputando, ipsum eruditi vituperatoribus qui ut.'
        }
    ];

    var itemTemplate = [{
            id: 1,
            budget_category_id: 1,
            item_name: 'Holidays',
            item_text: 'appareat dignissim ex vix',
            item_placeholder_text: 'Holidays',
            item_img_src: 'img1.jpg',
            item_sort_sequence: 0
        },
        {
            id: 2,
            budget_category_id: 1,
            item_name: 'Birthdays',
            item_text: 'appareat dignissim ex vix',
            item_placeholder_text: 'Birthdays',
            item_img_src: 'img2.jpg',
            item_sort_sequence: 1
        },
        {
            id: 3,
            budget_category_id: 1,
            item_name: 'Stuff for Kids',
            item_text: 'appareat dignissim ex vix',
            item_placeholder_text: 'Stuff for Kids',
            item_img_src: 'img3.jpg',
            item_sort_sequence: 2
        },
        {
            id: 4,
            budget_category_id: 1,
            item_name: 'P&C Insurance',
            item_text: 'appareat dignissim ex vix',
            item_placeholder_text: 'P&C Insurance',
            item_img_src: 'img4.jpg',
            item_sort_sequence: 3
        },
        {
            id: 5,
            budget_category_id: 1,
            item_name: 'Trips/ Vacation',
            item_text: 'appareat dignissim ex vix',
            item_placeholder_text: 'Trips/ Vacation',
            item_img_src: 'img5.jpg',
            item_sort_sequence: 4
        },
        {
            id: 6,
            budget_category_id: 1,
            item_name: 'Car/Home Maintenance',
            item_text: 'appareat dignissim ex vix',
            item_placeholder_text: 'Car/Home Maintenance',
            item_img_src: 'img6.jpg',
            item_sort_sequence: 5
        },
        {
            id: 7,
            budget_category_id: 1,
            item_name: 'Auto Registration',
            item_text: 'appareat dignissim ex vix',
            item_placeholder_text: 'Auto Registration',
            item_img_src: 'img7.jpg',
            item_sort_sequence: 6
        },
        {
            id: 8,
            budget_category_id: 1,
            item_name: 'Personal Care',
            item_text: 'appareat dignissim ex vix',
            item_placeholder_text: 'Personal Care',
            item_img_src: 'img8.jpg',
            item_sort_sequence: 7
        },
        {
            id: 9,
            budget_category_id: 1,
            item_name: 'Cash (Other / Random)',
            item_text: 'appareat dignissim ex vix',
            item_placeholder_text: 'Cash (Other / Random)',
            item_img_src: 'img9.jpg',
            item_sort_sequence: 8
        },
        {
            id: 10,
            budget_category_id: 2,
            item_name: '',
            item_text: 'appareat dignissim ex vix',
            item_placeholder_text: 'Add flexer',
            item_img_src: 'img30.jpg',
            item_sort_sequence: 0
        },
        {
            id: 11,
            budget_category_id: 4,
            item_name: 'Rent | Mortgage',
            item_text: 'appareat dignissim ex vix',
            item_placeholder_text: 'Rent | Mortgage',
            item_img_src: 'img10.jpg',
            item_sort_sequence: 0
        },
        {
            id: 12,
            budget_category_id: 4,
            item_name: 'Daycare',
            item_text: 'appareat dignissim ex vix',
            item_placeholder_text: 'Daycare',
            item_img_src: 'img11.jpg',
            item_sort_sequence: 1
        },
        {
            id: 13,
            budget_category_id: 4,
            item_name: 'Cars',
            item_text: 'appareat dignissim ex vix',
            item_placeholder_text: 'Cars',
            item_img_src: 'img12.jpg',
            item_sort_sequence: 2
        },
        {
            id: 14,
            budget_category_id: 4,
            item_name: 'P&C Insurance',
            item_text: 'appareat dignissim ex vix',
            item_placeholder_text: 'P&C Insurance',
            item_img_src: 'img13.jpg',
            item_sort_sequence: 3
        },
        {
            id: 15,
            budget_category_id: 4,
            item_name: 'Cell Phone',
            item_text: 'appareat dignissim ex vix',
            item_placeholder_text: 'Cell Phone',
            item_img_src: 'img14.jpg',
            item_sort_sequence: 4
        },
        {
            id: 16,
            budget_category_id: 4,
            item_name: 'Utilities',
            item_text: 'appareat dignissim ex vix',
            item_placeholder_text: 'Utilities (water,gas,elec,cable)',
            item_img_src: 'img15.jpg',
            item_sort_sequence: 5
        },
        {
            id: 17,
            budget_category_id: 4,
            item_name: 'Student Loans',
            item_text: 'appareat dignissim ex vix',
            item_placeholder_text: 'Student Loans',
            item_img_src: 'img16.jpg',
            item_sort_sequence: 6
        },
        {
            id: 18,
            budget_category_id: 4,
            item_name: 'Credit Card | Loans',
            item_text: 'appareat dignissim ex vix',
            item_placeholder_text: 'Credit Card | Loans',
            item_img_src: 'img17.jpg',
            item_sort_sequence: 7
        },
        {
            id: 19,
            budget_category_id: 4,
            item_name: 'Gas',
            item_text: 'appareat dignissim ex vix',
            item_placeholder_text: 'Gas',
            item_img_src: 'img18.jpg',
            item_sort_sequence: 8
        },
        {
            id: 20,
            budget_category_id: 4,
            item_name: 'Groceries',
            item_text: 'appareat dignissim ex vix',
            item_placeholder_text: 'Groceries',
            item_img_src: 'img19.jpg',
            item_sort_sequence: 9
        },
        {
            id: 21,
            budget_category_id: 3,
            item_name: 'Insurance',
            item_text: 'appareat dignissim ex vix',
            item_placeholder_text: 'Insurance',
            item_img_src: 'img20.jpg',
            item_sort_sequence: 0
        },
        {
            id: 22,
            budget_category_id: 3,
            item_name: 'Investments',
            item_text: 'appareat dignissim ex vix',
            item_placeholder_text: 'Investments',
            item_img_src: 'img21.jpg',
            item_sort_sequence: 1
        },
        {
            id: 23,
            budget_category_id: 3,
            item_name: 'Emergency Cash',
            item_text: 'appareat dignissim ex vix',
            item_placeholder_text: 'Emergency Cash',
            item_img_src: 'img22.jpg',
            item_sort_sequence: 2
        }
    ];

    // function to get info needed to build budget template
    // returns object for requested category
    getCategoryTemplate = function(category) {
       for (var i = 0; i < categoryTemplate.length; i++) {
         if (categoryTemplate[i].category_name === category) {
           return categoryTemplate[i];
         }
       }
    }; // end getCategoryTemplate

    // function to return template items for requested category
    // returns array of item objects
    getItemTemplate = function(category) {
        var categoryID = 0;
        for (var i = 0; i < categoryTemplate.length; i++) {
            if (categoryTemplate[i].category_name === category) {
                categoryID = categoryTemplate[i].id;
            }
        }
        var categoryItems = [];
        for (var j = 0; j < itemTemplate.length; j++) {
            if (itemTemplate[j].budget_category_id === categoryID) {
                categoryItems.push(itemTemplate[j]);
            }
        }
        return categoryItems;
    };  // end getItemTemplate

    console.log('Category Flow:', getCategoryTemplate('Flow'));
    console.log('Item Flow:', getItemTemplate('Flow'));
    console.log('Category Flex:', getCategoryTemplate('Flex'));
    console.log('Flex:', getItemTemplate('Flex'));

    var publicApi = {
        getCategoryTemplate: function(category) {
            return getCategoryTemplate(category);
        },
        getItemTemplate: function(category) {
            return getItemTemplate(category);
        }
    };

    return publicApi;

}); // END: TemplateFactory
