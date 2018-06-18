class SolidFoodFeeding < Event
	validates :amount_1, :notes, presence: true
end
