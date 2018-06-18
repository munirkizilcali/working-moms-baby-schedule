class DeleteRoleTypeFromUsers < ActiveRecord::Migration[5.2]
  def change
  	remove_column :users, :role_type
  end
end
