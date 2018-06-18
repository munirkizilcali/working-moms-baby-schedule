class BabyUser < ApplicationRecord
	belongs_to :baby 
	belongs_to :care_taker, class_name: 'User'

	validates :baby_id, :care_taker_id, presence: true
	validates_associated :baby, :care_taker 
end
