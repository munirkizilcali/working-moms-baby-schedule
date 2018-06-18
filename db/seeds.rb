# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

pinar = User.create({name:'Pinar', role_type:'mother', email:'test@test.com'})

melissa = Baby.create({name: 'Melissa', sex:'female', mother_id:1, birth:'16-02-2018'})

munir = User.create({name:'Munir', role_type:'father', email:'test2@test2.com'})

melissa.care_takers << munir

first_bottle = Bottle.new()

first_bottle.baby = melissa
first_bottle.user = pinar
first_bottle.amount_1 = 2
first_bottle.save

first_feeding = BottleFeeding.new()

first_feeding.bottle = first_bottle
first_feeding.baby = melissa
first_feeding.user = pinar
first_feeding.save

