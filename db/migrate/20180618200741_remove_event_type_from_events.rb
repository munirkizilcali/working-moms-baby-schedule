class RemoveEventTypeFromEvents < ActiveRecord::Migration[5.2]
  def change
    remove_column :events, :event_type, :string
  end
end
