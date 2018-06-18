class AddEventTimeToEvents < ActiveRecord::Migration[5.2]
  def change
    add_column :events, :event_time, :datetime
  end
end
