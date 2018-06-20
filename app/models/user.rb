class User < ApplicationRecord
	has_many :baby_users, foreign_key: 'care_taker_id'
	has_many :babies, through: :baby_users
	has_many :events
	has_many :care_takers, through: :babies

	validates :name, :email, presence: true
end
