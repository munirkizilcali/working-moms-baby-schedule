# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

pinar = User.create({name:'Pinar', role_type:'mother'})

melissa = Baby.create({name: 'Melissa', sex:'female', mother_id:1})


munir = User.create({name:'Munir', role_type:'father'})

melissa.care_takers << munir
