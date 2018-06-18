class Bottle < Event
	has_one :bottle_feeding
	validates :amount_1, presence: true
end
