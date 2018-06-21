class User < ApplicationRecord
	has_many :baby_users, foreign_key: 'care_taker_id', dependent: :destroy
	has_many :babies, through: :baby_users
	has_many :events, dependent: :destroy
	has_many :care_takers, through: :babies
	has_many :children, foreign_key: 'mother_id', class_name: 'Baby'

	validates :name, :email, presence: true
end
