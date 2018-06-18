class BottleFeeding < Event
	belongs_to :bottle
	validates :bottle_id, presence: true
end
