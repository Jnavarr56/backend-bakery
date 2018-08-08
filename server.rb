require "sinatra"
require "csv"


get "/" do
    send_file "public/index-home.html"
end

get "/login" do
    erb :login_initial
end

post "/my_account" do
    username_input =  params[:username]
    password_input =  params[:password]

    accounts_objs = []
    class Account
        attr_accessor :userName, :passWord, :firstName, :lastName, :status, :privilegeAcess, :org, :cart
        def initialize(userName, passWord, firstName, lastName, privilegeAcess, org, cart)
            @userName = userName 
            @passWord = passWord
            @firstName = firstName
            @lastName = lastName
            @privilegeAcess = privilegeAcess
            @org = org
            @cart =  cart
        end
    end   
    
    class Item
        attr_accessor :dessertType, :dessertName, :dessertDesc, :dessertPrice, :dessertCode, :pic
        def initialize(dessertType, dessertName, dessertDesc, dessertPrice, dessertCode, pic)
            @dessertType = dessertType
            @dessertName = dessertName
            @dessertDesc = dessertDesc
            @dessertPrice = dessertPrice
            @dessertCode = dessertCode
            @pic = pic
        end
    end  
    
    CSV.foreach("accounts_database.csv").with_index do |row, index|
        if index != 0
            account_obj = Account.new(row[0],row[1],row[2],row[3],row[4],row[5], row[6])
            accounts_objs.push(account_obj)
        end
    end

    @muffins_objs = []
    @cookies_objs = []
    @cakes_objs = []
    
    CSV.foreach("items_database.csv").with_index do |row, index|
        if index != 0
            item_obj = Item.new(row[0],row[1],row[2],row[3],row[4],row[5])
            if item_obj.dessertType === "muffin"
                @muffins_objs.push(item_obj)
            elsif item_obj.dessertType === "cookie"
                @cookies_objs.push(item_obj) 
            elsif item_obj.dessertType === "cake"
                @cakes_objs.push(item_obj)
            end
        end
    end

    
    $found_template = false
    $type = "" 


    accounts_objs.each.with_index do |account, index|
        if account.userName === username_input && account.passWord === password_input && account.privilegeAcess === "admin"
            puts "Account Match: " + account.userName + " admin"
            $found_template = true
            $type = "admin"  
            @name = account.firstName + " " + account.lastName
            @cartRec = account.cart
            
        elsif account.userName === username_input && account.passWord === password_input && account.privilegeAcess === "customer"
            puts "Account Match: " + account.userName + " customer"
            $found_template = true
            $type = "customer"
            @name = account.firstName + " " + account.lastName
            @user = account.userName
            @orgz = account.org
            @cartRec = account.cart
            puts account.cart
        end
    end

    if !$found_template && $type === ""
        puts "No Match: " + username_input
        erb :login_failed
    elsif $type === "customer"
        erb :my_account 
    elsif $type === "admin"
        erb :my_account_admin
    end    
end

post "/update_cart" do
    if params.length === 0
        params_array_strings = ""
    else
        params_array_strings = params.keys[0].split("|")
    end
    
    

    CSV.open("accounts_database.csv", "wb") do |csv_write|
        CSV.foreach("accounts_database_lag.csv") do |row|
           if row[0] === params_array_strings[params_array_strings.length-1] 
                row[6] = params_array_strings.slice(0..params_array_strings.length-2)
           end
           csv_write << row 
        end
    end

    
    File.rename("accounts_database_lag.csv", "accounts_database_lagA.csv")
   
    FileUtils.cp 'accounts_database.csv', 'accounts_database_lag.csv'
    
    puts params_array_strings
end