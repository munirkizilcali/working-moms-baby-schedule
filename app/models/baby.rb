class Baby < ApplicationRecord
	belongs_to :mother, class_name: 'User'
	has_many :events
	has_many :baby_users
	has_many :care_takers, through: :baby_users

	validates_associated :mother
	validates :name, :sex, :birth, presence: true


end
