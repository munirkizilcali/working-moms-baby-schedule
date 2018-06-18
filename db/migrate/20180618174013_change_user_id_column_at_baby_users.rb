class ChangeUserIdColumnAtBabyUsers < ActiveRecord::Migration[5.2]
  def change
  	rename_column :baby_users, :user_id, :care_taker_id
  end
end
