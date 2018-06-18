# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2018_06_18_201252) do

  create_table "babies", force: :cascade do |t|
    t.string "name"
    t.string "sex"
    t.date "birth"
    t.integer "mother_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "baby_users", force: :cascade do |t|
    t.integer "care_taker_id"
    t.integer "baby_id"
    t.string "role"
    t.boolean "active"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "events", force: :cascade do |t|
    t.integer "baby_id"
    t.integer "user_id"
    t.integer "amount_1"
    t.integer "amount_2"
    t.string "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "type"
    t.integer "bottle_id"
    t.datetime "event_time"
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
