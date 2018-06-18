class CreateBabyUsers < ActiveRecord::Migration[5.2]
  def change
    create_table :baby_users do |t|
      t.integer :user_id
      t.integer :baby_id
      t.string :role
      t.boolean :active

      t.timestamps
    end
  end
end
