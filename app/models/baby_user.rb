class BabyUser < ApplicationRecord
	belongs_to :baby 
	belongs_to :care_taker, class_name: 'User'
end
