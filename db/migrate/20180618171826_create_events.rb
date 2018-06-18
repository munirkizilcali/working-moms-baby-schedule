class CreateEvents < ActiveRecord::Migration[5.2]
  def change
    create_table :events do |t|
      t.integer :baby_id
      t.integer :user_id
      t.string :event_type
      t.integer :amount_1
      t.integer :amount_2
      t.string :notes

      t.timestamps
    end
  end
end
