class Event < ApplicationRecord
	belongs_to :baby
	belongs_to :user

	validates_associated :user, :baby
end
