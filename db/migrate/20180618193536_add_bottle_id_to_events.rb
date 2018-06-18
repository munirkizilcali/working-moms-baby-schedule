class AddBottleIdToEvents < ActiveRecord::Migration[5.2]
  def change
    add_column :events, :bottle_id, :integer
  end
end
