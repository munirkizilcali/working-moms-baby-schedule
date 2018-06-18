class CreateBabies < ActiveRecord::Migration[5.2]
  def change
    create_table :babies do |t|
      t.string :name
      t.string :sex
      t.date :birth
      t.integer :mother_id

      t.timestamps
    end
  end
end
